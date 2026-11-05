'use client';

import { useEffect, useRef, useState } from 'react';
import { DRAG_THRESHOLD, EDGE, PANEL_MAX_H, PANEL_W, POS_KEY } from './constants';

/** Robot speech-bubble cycle, idle peek, drag-to-move launcher, panel anchoring. */
export default function useChatLauncher({ open, setOpen, t }) {
  const launcherRef = useRef(null);
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
  const jokeCount = useRef(t.robotJokes.length);
  const lastPrompt = useRef(-1);
  const bubbleCtl = useRef(null);
  const textsRef = useRef(t);
  const eggCtl = useRef(null);
  const clicks = useRef({ n: 0, t: null });
  const quietRef = useRef(false); // user closed the bubbles with X (kept for this session)
  const [photoIdx, setPhotoIdx] = useState(0); // number = generic joke, string = photo key
  const photoCount = useRef(t.robotPhotoJokes.length);
  const photoKeys = useRef(Object.keys(t.robotPhotoComments));
  const [jokeIdx, setJokeIdx] = useState(-1); // -1 = first time: reveal the secret

  // Keep lengths/texts in refs for the long-lived robot timer effect (no re-subscribe on locale change).
  useEffect(() => {
    promptCount.current = t.robotPrompts.length;
    jokeCount.current = t.robotJokes.length;
    textsRef.current = t;
    photoCount.current = t.robotPhotoJokes.length;
    photoKeys.current = Object.keys(t.robotPhotoComments);
  }, [t]);

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
          const talk = i === 0 && !quietRef.current && Math.random() < 0.5;
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
      if (quietRef.current) return hide(); // bubbles off: just keep wandering
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
    // How long a bubble stays: ~2.5s + 70ms per character (5-14s), so long jokes can be read.
    const readTime = (text = '') => Math.min(14000, Math.max(5000, 2500 + text.length * 70));
    let eggNext = null;
    const eggText = () => (eggNext == null ? textsRef.current.robotSecret : textsRef.current.robotJokes[eggNext]) || '';
    const photoText = (i) =>
      (typeof i === 'string' ? textsRef.current.robotPhotoComments[i] : textsRef.current.robotPhotoJokes[i]) || '';
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
      eggNext = first ? null : pickJoke();
      setJokeIdx(eggNext ?? -1);
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
          }, Math.max(2500, readTime(eggText()) - 2400));
        }, 1100);
      }, 1300);
    };
    // Photo comments: when someone hovers or taps a photo, the robot makes a joke about it
    // (at most once every 20s, never while the chat is open or it is idle/hidden).
    let lastPhoto = 0;
    let lastPhotoIdx = -1;
    const photoSeen = {};
    const onPhoto = (e) => {
      const shown = e.type === 'photo-shown';
      // Opt-in: only elements marked data-robot-photo (real photos of Erza) trigger a joke,
      // so decorative figures (hero blueprint, project screenshots) stay quiet.
      const fig = shown ? null : e.target instanceof Element ? e.target.closest('[data-robot-photo]') : null;
      if (shown) return commentOn(e.detail?.src || '');
      if (fig?.closest('[data-polaroid]')) return undefined; // stacks report via 'photo-shown'
      if (!fig) return undefined;
      const im = fig.querySelector('img');
      if (im) commentOn(im.currentSrc || im.src || '');
      return undefined;
    };
    // Comment on one photo: a tapped photo, or the new top print of a polaroid stack.
    const commentOn = (src) => {
      if (!src || paused() || idle) return;
      // Which photo? next/image encodes the path in ?url=, e.g. /events/sfk-04.jpg -> 'sfk-04'.
      const raw = decodeURIComponent(src);
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
      setRobotMode('trick-dance');
      placeBubble();
      setBubbleShown(true);
      timer = setTimeout(() => {
        setRobotMode('normal');
        timer = setTimeout(() => {
          setBubbleShown(false);
          resume(GAP * 3);
        }, Math.max(3500, readTime(photoText(i)) - 1200));
      }, 1200);
    };
    document.addEventListener('pointerdown', onPhoto, { passive: true });
    window.addEventListener('photo-shown', onPhoto);
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
      window.removeEventListener('photo-shown', onPhoto);
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

  return {
    launcherRef,
    walkerRef,
    bubbleRef,
    quietRef,
    panelStyle,
    setPanelStyle,
    bubbleIdx,
    bubbleShown,
    setBubbleShown,
    robotMode,
    bubbleSide,
    photoIdx,
    jokeIdx,
    computePanelStyle,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onLauncherClick,
  };
}
