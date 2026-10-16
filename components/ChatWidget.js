'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';
import ChatMarkdown from './ChatMarkdown';
import ChatRobot from './ChatRobot';
import { useLocale } from './LocaleProvider';
import { getDict } from '@/lib/i18n';

const MAX_RETRIES = 3; // automatic resends after a rate limit
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag
const EDGE = 8; // keep the launcher this far from the viewport edges
const PANEL_W = 384;
const PANEL_MAX_H = 576;
const POS_KEY = 'chat-launcher-offset';

// Speech bubble placement per side; the squared corner acts as the tail toward the robot.
const BUBBLE_POS = {
  left: 'right-full bottom-[60%] mr-1 rounded-br-sm',
  right: 'left-full bottom-[60%] ml-1 rounded-bl-sm',
  'top-start': 'bottom-full left-0 mb-1 rounded-bl-sm',
  'top-end': 'bottom-full right-0 mb-1 rounded-br-sm',
};

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
  // Robot speech bubble + idle "peek". Two timers, each with one job and always
  // cleared before being re-armed: `timer` drives the bubble/mode chain
  // (wait ~3s, show a prompt ~8s, hide ~12s, repeat; or the idle/back sequence),
  // `idleTimer` checks for 30s without activity on a visible tab. Both are cleared on cleanup.
  // Prompt index and visibility are separate, so text never swaps mid-fade.
  const [bubbleIdx, setBubbleIdx] = useState(0); // number = prompt, or 'idle' / 'back'
  const [bubbleShown, setBubbleShown] = useState(false);
  const [robotMode, setRobotMode] = useState('normal'); // normal | hiding | peek | back | walking | returning | paused
  const walkerRef = useRef(null);
  // Bubble side: 'left' (default), 'right' if no room on the left, 'top' if neither.
  // 'top' also records which edge to align to so it stays inside the viewport.
  const [bubbleSide, setBubbleSide] = useState('left');
  const placeBubbleRef = useRef(null);
  const bubbleRef = useRef(null);
  const promptCount = useRef(t.robotPrompts.length);
  promptCount.current = t.robotPrompts.length;
  const jokeCount = useRef(t.robotJokes.length);
  jokeCount.current = t.robotJokes.length;
  const lastPrompt = useRef(-1);
  const bubbleCtl = useRef(null);
  const eggCtl = useRef(null);
  const clicks = useRef({ n: 0, t: null });
  const quiet = useRef(false); // user closed the bubbles with X (kept for this session)
  const [photoIdx, setPhotoIdx] = useState(0); // number = generic joke, string = photo key
  const photoCount = useRef(t.robotPhotoJokes.length);
  photoCount.current = t.robotPhotoJokes.length;
  const photoKeys = useRef(Object.keys(t.robotPhotoComments));
  photoKeys.current = Object.keys(t.robotPhotoComments);
  const [jokeIdx, setJokeIdx] = useState(-1); // -1 = first time: reveal the secret

  useEffect(() => {
    // Dev-only fast mode for testing: add ?robotdebug=1 to the URL (ignored in production).
    const debug =
      process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('robotdebug') === '1';
    // Cycle: prompt (VISIBLE) -> short gap -> walk out, pause, walk home -> gap -> prompt ...
    // The first prompt is shorter so the first walk starts ~8-10s after load;
    // after that a walk happens every ~20-30s.
    const FIRST = debug ? 1000 : 2000;
    const FIRST_VISIBLE = debug ? 2000 : 5500;
    const VISIBLE = debug ? 2500 : 6000;
    const GAP = debug ? 1000 : 4000; // between prompt and walk, and between walk and prompt
    const IDLE_AFTER = debug ? 10000 : 30000; // only counts while the tab is visible
    const HIDE_FOR = 1400;
    const LOOK_FOR = 2600;
    const BACK_FOR = 3000;
    let timer = null;
    let idleTimer = null;
    let chatOpen = false;
    let idle = false;
    let lastActivity = Date.now();
    // Walking: part of the same `timer` chain. home -> walking -> paused -> returning -> home.
    const WALK_SPEED = debug ? 160 : 70; // px per second
    const PAUSE_FOR = debug ? 1500 : 3000;
    const setWalk = (x, ms) => {
      const el = walkerRef.current;
      if (!el) return;
      el.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)` : 'none';
      const p = typeof x === 'object' ? x : { x, y: 0 };
      el.style.transform = p.x || p.y ? `translate(${p.x}px, ${p.y}px)` : '';
    };
    const BUBBLE_W = 220 + 4; // max bubble width + gap
    const MARGIN = 8;
    const fitBubble = () => {
      const b = bubbleRef.current;
      if (!b) return;
      b.style.transform = '';
      const r = b.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let dx = 0;
      let dy = 0;
      if (r.left < MARGIN) dx = MARGIN - r.left;
      else if (r.right > vw - MARGIN) dx = vw - MARGIN - r.right;
      if (r.top < MARGIN) dy = MARGIN - r.top;
      else if (r.bottom > vh - MARGIN) dy = vh - MARGIN - r.bottom;
      if (dx || dy) b.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const placeBubble = () => {
      const el = walkerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const need = Math.min(BUBBLE_W, vw - 2 * MARGIN);
      let side;
      if (rect.left - MARGIN >= need) side = 'left';
      else if (vw - rect.right - MARGIN >= need) side = 'right';
      else side = rect.left + rect.width / 2 < vw / 2 ? 'top-start' : 'top-end';
      setBubbleSide(side);
      // After React applies the side, measure the real bubble and nudge it fully inside the viewport.
      requestAnimationFrame(() => requestAnimationFrame(fitBubble));
    };
    placeBubbleRef.current = placeBubble;
    const goHome = () => {
      setWalk(0, 0);
      setRobotMode('normal');
    };
    const canWalk = () =>
      !paused() && !idle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const walk = (then) => {
      const el = walkerRef.current;
      if (!el) return then();
      // Wander: 2-4 random stops (left/right and up/down, zigzag), a trick at each, then home.
      const rect = el.getBoundingClientRect();
      const small = window.innerWidth < 640;
      const roomX = Math.min(rect.left - 8, small ? 120 : 420);
      const roomY = Math.min(rect.top - 8, small ? 160 : 320);
      if (roomX < 40) return then();
      const stops = 2 + Math.floor(Math.random() * 3);
      const path = [];
      for (let i = 0; i < stops; i++) {
        path.push({ x: -(20 + Math.random() * (roomX - 20)), y: -(Math.random() * Math.max(0, roomY)) });
      }
      path.push({ x: 0, y: 0 });
      let pos = { x: 0, y: 0 };
      const tricks = ['jump', 'spin', 'dance', null];
      const step = (i) => {
        const to = path[i];
        const dist = Math.hypot(to.x - pos.x, to.y - pos.y);
        const ms = Math.max(400, Math.round((dist / WALK_SPEED) * 1000));
        setRobotMode(to.x < pos.x ? 'walking' : 'returning'); // faces the way it goes
        setWalk(to, ms);
        pos = to;
        timer = setTimeout(() => {
          if (i === path.length - 1) {
            setRobotMode('normal');
            placeBubble();
            return then();
          }
          const trick = tricks[Math.floor(Math.random() * tricks.length)];
          setRobotMode(trick ? `trick-${trick}` : 'paused');
          if (trick) setTimeout(() => setRobotMode((m) => (m.startsWith('trick-') ? 'paused' : m)), 1200);
          const talk = i === 0 && !quiet.current && Math.random() < 0.5;
          if (talk) {
            const next = pickNext();
            lastPrompt.current = next;
            setBubbleIdx(next);
            placeBubble();
            setBubbleShown(true);
          }
          timer = setTimeout(() => {
            setBubbleShown(false);
            step(i + 1);
          }, talk ? PAUSE_FOR : 1600);
        }, ms);
      };
      step(0);
    };


    const paused = () => chatOpen || document.visibilityState === 'hidden';
    const clear = () => {
      clearTimeout(timer);
      timer = null;
    };
    const pickNext = () => {
      const count = promptCount.current;
      const last = lastPrompt.current;
      if (last < 0 || count < 2) return 0; // prompt 1 first
      let next = Math.floor(Math.random() * (count - 1));
      if (next >= last) next += 1; // never the same twice in a row
      return next;
    };
    const show = () => {
      if (paused() || idle) return;
      if (quiet.current) return hide(); // bubbles off: just keep wandering
      const next = pickNext();
      lastPrompt.current = next;
      setBubbleIdx(next);
      placeBubble();
      setBubbleShown(true);
      timer = setTimeout(hide, lastShown++ === 0 ? FIRST_VISIBLE : VISIBLE);
    };
    let lastShown = 0;
    function hide() {
      setBubbleShown(false);
      timer = setTimeout(() => {
        // No auto-walking (it covered page text); it only moves when dragged.
        // Instead it does a small trick in place now and then.
        if (canWalk() && Math.random() < 0.6) {
          const tricks = ['jump', 'spin', 'dance'];
          setRobotMode(`trick-${tricks[Math.floor(Math.random() * tricks.length)]}`);
          timer = setTimeout(() => {
            setRobotMode('normal');
            timer = setTimeout(show, GAP);
          }, 1300);
        } else timer = setTimeout(show, GAP * 2);
      }, GAP);
    }
    const pause = () => {
      clear();
      setBubbleShown(false);
      goHome();
    };
    const resume = (delay) => {
      clear();
      if (!paused()) timer = setTimeout(show, delay);
    };

    // Idle sequence: slide away, peek out, look around, then ask.
    const goIdle = () => {
      idle = true;
      clear();
      setWalk(0, 0);
      setBubbleShown(false);
      setRobotMode('hiding');
      timer = setTimeout(() => {
        setRobotMode('peek');
        timer = setTimeout(() => {
          setBubbleIdx('idle');
          placeBubble();
      setBubbleShown(true);
          timer = null;
        }, LOOK_FOR);
      }, HIDE_FOR);
    };
    const comeBack = () => {
      idle = false;
      clear();
      setRobotMode('back');
      setBubbleIdx('back');
      placeBubble();
      setBubbleShown(true);
      timer = setTimeout(() => {
        setRobotMode('normal');
        setBubbleShown(false);
        resume(GAP / 2);
      }, BACK_FOR);
    };
    const armIdle = (delay = IDLE_AFTER) => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(checkIdle, delay);
    };
    function checkIdle() {
      const left = IDLE_AFTER - (Date.now() - lastActivity);
      if (document.visibilityState !== 'visible') return undefined; // re-armed when visible again
      if (left > 0 || chatOpen) return armIdle(Math.max(left, 1000));
      goIdle();
    }
    // Cheap on every event: just stamp the time, unless we were idle.
    const onActivity = () => {
      lastActivity = Date.now();
      if (idle) {
        comeBack();
        armIdle();
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        clearTimeout(idleTimer); // don't count while the tab is hidden
        if (!idle) pause();
      } else {
        onActivity(); // restart the idle count from 0
        armIdle();
        if (!idle && timer === null) resume(FIRST);
      }
    };

    // Easter egg (double click): dance, spin, tell a joke, then carry on.
    let eggSeen = false;
    eggCtl.current = () => {
      if (idle) return;
      clear();
      goHome();
      const first = !eggSeen;
      eggSeen = true;
      // first time: the secret hint, then a random joke (never the same twice)
      // Shuffle bag saved in localStorage: every joke is shown once before any repeats,
      // even across visits. When all were seen, start a new round (not with the last one).
      const pickJoke = () => {
        const n = jokeCount.current;
        let seen = [];
        try { seen = JSON.parse(localStorage.getItem('robot-jokes-seen') || '[]'); } catch {}
        seen = seen.filter((i) => Number.isInteger(i) && i < n);
        let left = [...Array(n).keys()].filter((i) => !seen.includes(i));
        if (!left.length) {
          const last = seen[seen.length - 1];
          seen = [];
          left = [...Array(n).keys()].filter((i) => i !== last);
        }
        const pick = left[Math.floor(Math.random() * left.length)];
        try { localStorage.setItem('robot-jokes-seen', JSON.stringify([...seen, pick])); } catch {}
        return pick;
      };
      setJokeIdx(first ? -1 : pickJoke());
      setBubbleIdx('joke');
      setRobotMode('trick-dance');
      placeBubble();
      setBubbleShown(true);
      timer = setTimeout(() => {
        setRobotMode('trick-spin');
        timer = setTimeout(() => {
          setRobotMode('normal');
          timer = setTimeout(() => {
            setBubbleShown(false);
            resume(GAP);
          }, 3500);
        }, 1100);
      }, 1300);
    };
    // Photo comments: when someone hovers or taps a photo, the robot makes a joke about it
    // (at most once every 20s, never while the chat is open or it is idle/hidden).
    let lastPhoto = 0;
    let lastPhotoIdx = -1;
    const photoSeen = {};
    const onPhoto = (e) => {
      const fig = e.target instanceof Element ? e.target.closest('figure') : null;
      // Only a real tap/click on a photo (not hovering past it), so the comment is always about that photo.
      if (!fig || !fig.querySelector('img') || paused() || idle) return;
      // Which photo? next/image encodes the path in ?url=, e.g. /events/sfk-04.jpg -> 'sfk-04'.
      const img = fig.querySelector('img');
      const raw = decodeURIComponent(img.currentSrc || img.src || '');
      const key = (raw.match(/\/([\w-]+)\.(?:jpe?g|png|webp)/i) || [])[1];
      lastPhoto = Date.now();
      if (key) photoSeen[key] = lastPhoto;
      const n = photoCount.current;
      let i = key && photoKeys.current.includes(key) ? key : Math.floor(Math.random() * n);
      if (typeof i === 'number' && i === lastPhotoIdx && n > 1) i = (i + 1) % n;
      lastPhotoIdx = i;
      clear();
      goHome();
      setPhotoIdx(i);
      setBubbleIdx('photo');
      setRobotMode('trick-jump');
      placeBubble();
      setBubbleShown(true);
      timer = setTimeout(() => {
        setRobotMode('normal');
        timer = setTimeout(() => {
          setBubbleShown(false);
          resume(GAP * 3);
        }, 4800);
      }, 1200);
    };
    document.addEventListener('pointerdown', onPhoto, { passive: true });
    bubbleCtl.current = (isOpen) => {
      if (isOpen === chatOpen) return;
      chatOpen = isOpen;
      if (isOpen) {
        idle = false;
        pause();
      } else {
        lastActivity = Date.now();
        resume(FIRST);
      }
    };
    const EVENTS = ['mousemove', 'pointermove', 'pointerdown', 'click', 'keydown', 'scroll', 'wheel', 'touchstart'];
    EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', placeBubble);
    resume(FIRST);
    armIdle();
    return () => {
      clear();
      clearTimeout(idleTimer);
      bubbleCtl.current = null;
      eggCtl.current = null;
      document.removeEventListener('pointerdown', onPhoto);
      EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', placeBubble);
      placeBubbleRef.current = null;
    };
  }, []);

  useEffect(() => {
    bubbleCtl.current?.(open);
  }, [open]);

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
      const walker = walkerRef.current;
      if (walker) {
        const walkX = new DOMMatrixReadOnly(getComputedStyle(walker).transform).m41 || 0;
        walker.style.transition = 'none';
        walker.style.transform = '';
        if (walkX) {
          applyOffset(clampOffset({ x: offset.current.x + walkX, y: offset.current.y }));
          d.start = offset.current;
        }
      }
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
    placeBubbleRef.current?.();
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
    // Wait a moment so a double click can trigger the easter egg instead of toggling the chat.
    const c = clicks.current;
    c.n += 1;
    clearTimeout(c.t);
    if (c.n >= 2) {
      c.n = 0;
      setOpen(false);
      eggCtl.current?.();
      return;
    }
    c.t = setTimeout(() => {
      const n = c.n;
      c.n = 0;
      if (!open) setPanelStyle(computePanelStyle());
      setOpen((o) => !o);
    }, 300);
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
        aria-label={open ? t.close : t.robotLabel}
        className={`group fixed right-3 bottom-3 z-70 cursor-grab touch-none items-center rounded-full select-none data-[dragging=true]:cursor-grabbing p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk sm:right-5 sm:bottom-5 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <span ref={walkerRef} className="relative block">
        <span
          ref={bubbleRef}
          aria-hidden="true"
          className={`pointer-events-none absolute w-max max-w-[min(220px,calc(100vw-16px))] ${BUBBLE_POS[bubbleSide]} whitespace-normal wrap-break-word rounded-2xl border border-ink/15 bg-paper px-3 py-2 text-left text-sm leading-snug text-ink shadow-lg transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none ${
            bubbleShown && !open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
        >
          <span
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              quiet.current = true;
              // quiet for 1 minute only, then the prompts come back
              setTimeout(() => (quiet.current = false), 60000);
              setBubbleShown(false);
            }}
            className={`absolute -top-2 -right-2 grid size-5 cursor-pointer place-items-center rounded-full border border-ink/15 bg-paper text-[10px] leading-none text-ink/70 shadow hover:text-ink ${bubbleShown && !open ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            ✕
          </span>
          {bubbleIdx === 'photo' ? (typeof photoIdx === 'string' ? t.robotPhotoComments[photoIdx] : t.robotPhotoJokes[photoIdx]) : bubbleIdx === 'joke' ? (jokeIdx < 0 ? t.robotSecret : t.robotJokes[jokeIdx]) : bubbleIdx === 'idle' ? t.robotIdle : bubbleIdx === 'back' ? t.robotBack : (t.robotPrompts[bubbleIdx] ?? t.robotPrompts[0])}
        </span>
        <ChatRobot mode={open ? 'normal' : robotMode} />
        </span>
      </button>
    </>
  );
}
