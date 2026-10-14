'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';

const SUGGESTIONS = [
  'What projects has she built?',
  'What did she do at AnchorzUp?',
  'What motivates her?',
];
const GREETING = {
  role: 'assistant',
  content: "Hi! I can tell you about Erza's projects, internship and volunteering. Ask in English or Albanian.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);

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
    if (!question || loading) return;
    const history = [...messages.filter((m) => m !== GREETING), { role: 'user', content: question }];
    setMessages([GREETING, ...history]);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
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
      if (!reply) throw new Error('No answer came back. Please try again.');
    } catch (err) {
      setMessages((m) => (m.at(-1)?.role === 'assistant' && !m.at(-1).content ? m.slice(0, -1) : m));
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

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
            className="fixed inset-x-0 bottom-0 z-70 flex max-h-[85vh] flex-col border-t-2 border-thread bg-ink text-paper shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96 sm:max-h-[min(36rem,75vh)] sm:rounded-sm sm:border-t-2"
            {...motionProps}
          >
            <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
              <div>
                <h2 id="chat-title" className="font-display text-2xl italic leading-tight">
                  Ask about Erza
                </h2>
                <p className="mt-1 text-xs text-paper/70">An AI assistant. Answers use what is on this site.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                className="-mr-1 rounded-sm px-2 py-1 text-xl leading-none text-paper/80 hover:text-paper focus-visible:outline-2 focus-visible:outline-chalk"
                aria-label="Close chat"
              >
                ×
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-2"
              aria-live="polite"
              aria-busy={loading}
              data-lenis-prevent
            >
              {messages.map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[88%] whitespace-pre-wrap text-[0.95rem] leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto rounded-sm bg-paper px-3 py-2 text-ink'
                      : 'border-l-2 border-thread pl-3 text-paper'
                  }`}
                >
                  <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Assistant: '}</span>
                  {m.content}
                </p>
              ))}
              {loading && messages.at(-1)?.role === 'user' && (
                <p className="border-l-2 border-thread pl-3 text-sm italic text-paper/70">Thinking…</p>
              )}
              {error && (
                <p role="alert" className="rounded-sm bg-chalk px-3 py-2 text-sm text-ink">
                  {error}
                </p>
              )}
              {onlyGreeting && (
                <ul className="flex flex-wrap gap-2 pt-1" aria-label="Suggested questions">
                  {SUGGESTIONS.map((s) => (
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
                Your question
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
                placeholder="Ask a question…"
                className="max-h-28 min-h-10 flex-1 resize-none rounded-sm bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-ink/50 focus:outline-2 focus:outline-chalk"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 rounded-sm bg-thread px-4 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-chalk"
              >
                Send
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-title"
        className={`fixed right-4 bottom-4 z-70 items-center gap-2 rounded-full bg-ink py-3 pr-5 pl-4 text-paper shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-thread" />
        <span className="font-display text-lg italic leading-none">{open ? 'Close' : 'Ask about Erza'}</span>
      </button>
    </>
  );
}
