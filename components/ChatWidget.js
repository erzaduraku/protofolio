'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';
import ChatMarkdown from './ChatMarkdown';
import { useLocale } from './LocaleProvider';
import { getDict } from '@/lib/i18n';

const MAX_RETRIES = 3; // automatic resends after a rate limit
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag
const EDGE = 8; // keep the launcher this far from the viewport edges
const PANEL_W = 384;
const PANEL_MAX_H = 576;
const POS_KEY = 'chat-launcher-offset';

// The greeting is a marker; its text is rendered in the page language.
const GREETING = { role: 'assistant', content: '', greeting: true };

export default function ChatWidget() {
  const locale = useLocale();
  const t = getDict(locale).chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(null); // { history, attempt, left } while counting down to a resend
  const [rateFailed, setRateFailed] = useState(null); // history to resend by hand after MAX_RETRIES
  const busy = loading || Boolean(wait);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  // Drag offset from the default bottom-right spot, applied straight to the DOM
  // (no state), so server and client render the same markup.
  const offset = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const justDragged = useRef(false);
  const [panelStyle, setPanelStyle] = useState(undefined);

  function clampOffset(next) {
    const el = launcherRef.current;
    if (!el) return next;
    const rect = el.getBoundingClientRect();
    const baseLeft = rect.left - offset.current.x;
    const baseTop = rect.top - offset.current.y;
    const minX = EDGE - baseLeft;
    const maxX = window.innerWidth - EDGE - (baseLeft + rect.width);
    const minY = EDGE - baseTop;
    const maxY = window.innerHeight - EDGE - (baseTop + rect.height);
    return {
      x: Math.min(maxX, Math.max(minX, next.x)),
      y: Math.min(maxY, Math.max(minY, next.y)),
    };
  }

  function applyOffset(next) {
    offset.current = next;
    if (launcherRef.current) {
      launcherRef.current.style.transform = next.x || next.y ? `translate3d(${next.x}px, ${next.y}px, 0)` : '';
    }
  }

  // Anchor the panel to the launcher (sm and up); mobile keeps the full-width sheet.
  function computePanelStyle() {
    const el = launcherRef.current;
    if (!el || window.innerWidth < 640) return undefined;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const right = Math.min(Math.max(vw - rect.right, EDGE), vw - PANEL_W - EDGE);
    const above = rect.top - EDGE - 12;
    const below = vh - rect.bottom - EDGE - 12;
    if (above >= below) {
      return { right, left: 'auto', top: 'auto', bottom: vh - rect.top + 12, maxHeight: Math.min(PANEL_MAX_H, above) };
    }
    return { right, left: 'auto', bottom: 'auto', top: rect.bottom + 12, maxHeight: Math.min(PANEL_MAX_H, below) };
  }

  // Restore a position saved earlier in this session, and re-clamp on resize.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(POS_KEY) || 'null');
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) applyOffset(clampOffset(saved));
    } catch {
      /* ignore bad storage */
    }
    const onResize = () => {
      applyOffset(clampOffset(offset.current));
      setPanelStyle(computePanelStyle());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function onPointerDown(e) {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, start: offset.current, moved: false };
  }

  function onPointerMove(e) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.transition = 'none';
      e.currentTarget.dataset.dragging = 'true';
    }
    applyOffset(clampOffset({ x: d.start.x + dx, y: d.start.y + dy }));
    if (open) setPanelStyle(computePanelStyle());
  }

  function onPointerEnd(e) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    justDragged.current = true; // swallow the click that follows a drag
    e.currentTarget.style.transition = '';
    delete e.currentTarget.dataset.dragging;
    try {
      sessionStorage.setItem(POS_KEY, JSON.stringify(offset.current));
    } catch {
      /* storage unavailable */
    }
  }

  function onLauncherClick() {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    if (!open) setPanelStyle(computePanelStyle());
    setOpen((o) => !o);
  }

  // Focus the input on open; Esc closes and restores focus.
  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send(text) {
    const question = text.trim().slice(0, 1000);
    if (!question || busy) return;
    const history = [...messages.filter((m) => m !== GREETING), { role: 'user', content: question }];
    setMessages([GREETING, ...history]);
    setInput('');
    request(history, 0);
  }

  // Sends the conversation. A rate limit (429 "rate_limited") waits retryAfter seconds and resends
  // the same history (the question is shown once), up to MAX_RETRIES times.
  async function request(history, attempt) {
    setError('');
    setRateFailed(null);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, locale }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429 && data.error === 'rate_limited') {
          if (attempt < MAX_RETRIES) {
            const seconds = Math.min(60, Math.max(1, Math.ceil(Number(data.retryAfter) || 20)));
            setWait({ history, attempt: attempt + 1, left: seconds });
          } else {
            setRateFailed(history);
          }
          return;
        }
        throw new Error(data.error || t.genericError);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: reply }]);
      }
      if (!reply) throw new Error(t.empty);
    } catch (err) {
      setMessages((m) => (m.at(-1)?.role === 'assistant' && !m.at(-1).content ? m.slice(0, -1) : m));
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Live countdown; at zero the same question is sent again.
  useEffect(() => {
    if (!wait) return undefined;
    const id = setTimeout(() => {
      if (wait.left <= 1) {
        setWait(null);
        request(wait.history, wait.attempt);
      } else {
        setWait({ ...wait, left: wait.left - 1 });
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [wait]); // eslint-disable-line react-hooks/exhaustive-deps

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 12 },
        transition: { duration: 0.22, ease: [0.2, 0.7, 0.2, 1] },
      };
  const onlyGreeting = messages.length === 1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            ref={panelRef}
            key="chat"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            style={panelStyle}
            className="fixed inset-x-0 bottom-0 z-70 flex max-h-[85vh] flex-col border-t-2 border-thread bg-ink text-paper shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96 sm:max-h-[min(36rem,75vh)] sm:rounded-sm sm:border-t-2"
            {...motionProps}
          >
            <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
              <div>
                <h2 id="chat-title" className="font-display text-2xl italic leading-tight">
                  {t.title}
                </h2>
                <p className="mt-1 text-xs text-paper/70">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                className="-mr-1 rounded-sm px-2 py-1 text-xl leading-none text-paper/80 hover:text-paper focus-visible:outline-2 focus-visible:outline-chalk"
                aria-label={t.close}
              >
                ×
              </button>
            </header>

            <div
              ref={listRef}
              className="chat-scroll min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-5 py-2"
              aria-live="polite"
              aria-busy={loading}
              data-lenis-prevent
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] min-w-0 text-[0.95rem] leading-relaxed wrap-anywhere ${
                    m.role === 'user'
                      ? 'ml-auto rounded-sm bg-paper px-3 py-2 text-ink'
                      : 'border-l-2 border-thread pl-3 text-paper'
                  }`}
                >
                  <span className="sr-only">{m.role === 'user' ? t.you : t.assistant}</span>
                  {m.role === 'user' ? (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  ) : (
                    <ChatMarkdown text={m.greeting ? t.greeting : m.content} />
                  )}
                </div>
              ))}
              {loading && !wait && messages.at(-1)?.role === 'user' && (
                <p className="border-l-2 border-thread pl-3 text-sm italic text-paper/70">{t.thinking}</p>
              )}
              {wait && (
                <p role="status" className="border-l-2 border-paper/40 pl-3 text-sm italic text-paper/80">
                  {t.rateWait(wait.left)}
                </p>
              )}
              {rateFailed && !wait && (
                <div role="status" className="border-l-2 border-paper/40 pl-3 text-sm text-paper/80">
                  <p className="italic">{t.rateFinal}</p>
                  <button
                    type="button"
                    onClick={() => request(rateFailed, 0)}
                    disabled={busy}
                    className="mt-2 rounded-full border border-paper/30 px-3 py-1 text-sm text-paper hover:border-chalk hover:text-chalk disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-chalk"
                  >
                    {t.retry}
                  </button>
                </div>
              )}
              {error && (
                <p role="alert" className="rounded-sm bg-chalk px-3 py-2 text-sm text-ink">
                  {error}
                </p>
              )}
              {onlyGreeting && (
                <ul className="flex flex-wrap gap-2 pt-1" aria-label={t.suggested}>
                  {t.suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-paper/30 px-3 py-1.5 text-left text-sm text-paper hover:border-chalk hover:text-chalk focus-visible:outline-2 focus-visible:outline-chalk"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-paper/15 px-4 py-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t.question}
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                maxLength={1000}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t.placeholder}
                className="max-h-28 min-h-10 flex-1 resize-none rounded-sm bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-ink/50 focus:outline-2 focus:outline-chalk"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-10 rounded-sm bg-thread px-4 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-chalk"
              >
                {t.send}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={onLauncherClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        aria-expanded={open}
        aria-controls="chat-title"
        className={`fixed right-4 bottom-4 z-70 cursor-grab touch-none items-center gap-2 rounded-full select-none data-[dragging=true]:cursor-grabbing bg-ink p-3.5 text-paper sm:py-3 sm:pr-5 sm:pl-4 shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <span aria-hidden="true" className="hidden h-2 w-2 rounded-full bg-thread sm:inline-block" />
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M4 5h16v11H9l-5 4z" />
          <circle cx="17.5" cy="6.5" r="2.5" fill="var(--color-thread)" stroke="none" />
        </svg>
        <span className="sr-only font-display text-lg italic leading-none sm:not-sr-only">{open ? t.closeShort : t.title}</span>
      </button>
    </>
  );
}
