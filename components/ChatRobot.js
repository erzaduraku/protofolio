'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './ChatRobot.module.css';

// Cute chibi robot used as the chat launcher. Purely visual (aria-hidden);
// the surrounding <button> carries the label.
export default function ChatRobot({ mode = 'normal' }) {
  const wrapRef = useRef(null);
  const lookRef = useRef(null);

  // Eyes follow the mouse (fine pointers only), throttled to one update per frame;
  // antennas perk up when the cursor is near; eyes drift back to center after a pause.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return undefined;
    let frame = 0;
    let drift = null;
    let px = 0;
    let py = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      const look = lookRef.current;
      if (!wrap || !look) return;
      const rect = wrap.getBoundingClientRect();
      const dx = px - (rect.left + rect.width / 2);
      const dy = py - (rect.top + rect.height * 0.4);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 200) * 3.5; // max ~3.5 svg units inside the visor
      look.style.transform = ['normal', 'paused', 'walking', 'returning'].includes(wrap.dataset.mode) ? `translate(${(wrap.dataset.mode === 'walking' ? -1 : 1) * (dx / dist) * k}px, ${(dy / dist) * k * 0.6}px)` : '';
      if (dist < 160) wrap.dataset.near = 'true';
      else delete wrap.dataset.near;
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(drift);
      drift = setTimeout(() => {
        if (lookRef.current) lookRef.current.style.transform = '';
        if (wrapRef.current) delete wrapRef.current.dataset.near;
      }, 2500);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      clearTimeout(drift);
    };
  }, []);

  // Random life moments: a double blink or a curious tilt every 7-15s (one timer chain).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = null;
    const next = () => {
      timer = setTimeout(() => {
        const wrap = wrapRef.current;
        if (wrap && wrap.dataset.mode === 'normal') {
          wrap.dataset.life = Math.random() < 0.5 ? 'dblink' : 'tilt';
          timer = setTimeout(() => {
            if (wrapRef.current) delete wrapRef.current.dataset.life;
            next();
          }, 1300);
        } else {
          next();
        }
      }, 7000 + Math.random() * 8000);
    };
    next();
    return () => clearTimeout(timer);
  }, []);

  const id = useId().replace(/:/g, '');
  const metal = `metal-${id}`;
  const metalBody = `metalBody-${id}`;
  const visor = `visor-${id}`;
  const glow = `glow-${id}`;
  const chest = `chest-${id}`;
  const shine = `shine-${id}`;
  return (
    <span ref={wrapRef} className={styles.wrap} data-mode={mode} aria-hidden="true">
    <span className={styles.float}>
      <svg viewBox="0 0 100 110" className={styles.robot}>
        <defs>
          <radialGradient id={metal} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e3e7ec" />
            <stop offset="75%" stopColor="#a9b1bb" />
            <stop offset="100%" stopColor="#6f7882" />
          </radialGradient>
          <linearGradient id={metalBody} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4f6f8" />
            <stop offset="55%" stopColor="#bcc3cb" />
            <stop offset="100%" stopColor="#7b848e" />
          </linearGradient>
          <linearGradient id={visor} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b3440" />
            <stop offset="100%" stopColor="#0b0f14" />
          </linearGradient>
          <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={chest} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#8ff3ff" />
            <stop offset="100%" stopColor="#1fb6d6" />
          </radialGradient>
          <filter id={glow} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* legs */}
        <g className={styles.legL}>
        <rect x="38" y="92" width="9" height="12" rx="3" fill={`url(#${metalBody})`} />
        <ellipse cx="42.5" cy="105" rx="7" ry="3.5" fill="#5f6873" />
        </g>
        <g className={styles.legR}>
        <rect x="53" y="92" width="9" height="12" rx="3" fill={`url(#${metalBody})`} />
        <ellipse cx="57.5" cy="105" rx="7" ry="3.5" fill="#5f6873" />
        </g>

        {/* left arm (down) */}
        <g>
          <circle cx="29" cy="76" r="4" fill={`url(#${metal})`} />
          <circle cx="25" cy="82" r="3.6" fill={`url(#${metal})`} />
          <circle cx="23" cy="88" r="4.2" fill={`url(#${metalBody})`} />
        </g>

        {/* body */}
        <rect x="31" y="68" width="38" height="28" rx="13" fill={`url(#${metalBody})`} />
        <circle className={styles.chest} cx="50" cy="81" r="5" fill={`url(#${chest})`} filter={`url(#${glow})`} />

        {/* right arm (raised, waving) */}
        <g className={styles.arm}>
          <circle cx="71" cy="74" r="4" fill={`url(#${metal})`} />
          <circle cx="76" cy="68" r="3.6" fill={`url(#${metal})`} />
          <circle cx="80" cy="62" r="3.4" fill={`url(#${metal})`} />
          <circle cx="83" cy="55" r="4.6" fill={`url(#${metalBody})`} />
        </g>

        {/* head */}
        <g className={styles.head}>
          <g className={styles.antennaL}>
            <line x1="38" y1="18" x2="32" y2="5" stroke="#8a939d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="5" r="3" fill="#8ff3ff" filter={`url(#${glow})`} />
          </g>
          <g className={styles.antennaR}>
            <line x1="62" y1="18" x2="68" y2="5" stroke="#8a939d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="68" cy="5" r="3" fill="#8ff3ff" filter={`url(#${glow})`} />
          </g>
          <circle cx="50" cy="42" r="30" fill={`url(#${metal})`} />
          <ellipse cx="19.5" cy="44" rx="4" ry="7" fill="#9aa3ad" />
          <ellipse cx="80.5" cy="44" rx="4" ry="7" fill="#9aa3ad" />
          <rect x="27" y="30" width="46" height="28" rx="14" fill={`url(#${visor})`} />
          <path d="M32 34 q18 -6 36 0 v3 q-18 -5 -36 0z" fill={`url(#${shine})`} />
          <g ref={lookRef} className={styles.look}>
          <g className={styles.eyes} filter={`url(#${glow})`}>
            {/* expressions: only one group is visible at a time (see CSS) */}
            <g className={styles.eyeRound}>
              <ellipse cx="40" cy="44" rx="6" ry="6.8" fill="#bff8ff" />
              <ellipse cx="60" cy="44" rx="6" ry="6.8" fill="#bff8ff" />
              <circle cx="42" cy="41.8" r="2.2" fill="#ffffff" />
              <circle cx="62" cy="41.8" r="2.2" fill="#ffffff" />
              <circle cx="38.2" cy="46.6" r="0.9" fill="#ffffff" />
              <circle cx="58.2" cy="46.6" r="0.9" fill="#ffffff" />
            </g>
            <g className={styles.eyeHappy} fill="none" stroke="#bff8ff" strokeWidth="3" strokeLinecap="round">
              <path d="M34.5 46 q5.5 -7 11 0" />
              <path d="M54.5 46 q5.5 -7 11 0" />
            </g>
            <g className={styles.eyeWow}>
              <circle cx="40" cy="44" r="7.6" fill="none" stroke="#bff8ff" strokeWidth="2.2" />
              <circle cx="60" cy="44" r="7.6" fill="none" stroke="#bff8ff" strokeWidth="2.2" />
              <circle cx="40" cy="44" r="2.6" fill="#bff8ff" />
              <circle cx="60" cy="44" r="2.6" fill="#bff8ff" />
            </g>
            <g className={styles.eyeSad} fill="#bff8ff">
              <path d="M34 42 h12 v3 a6 5 0 0 1 -12 0z" />
              <path d="M54 42 h12 v3 a6 5 0 0 1 -12 0z" />
            </g>
          </g>
          </g>
          {/* mouth + blush */}
          <path className={styles.mouthSmile} d="M45 52.5 q5 3.5 10 0" fill="none" stroke="#bff8ff" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse className={styles.mouthO} cx="50" cy="53.5" rx="2.2" ry="2.6" fill="#bff8ff" />
          <g className={styles.blush} fill="#ff8fb1">
            <ellipse cx="31.5" cy="51" rx="3.2" ry="1.8" />
            <ellipse cx="68.5" cy="51" rx="3.2" ry="1.8" />
          </g>
          <ellipse cx="38" cy="22" rx="10" ry="5" fill="#ffffff" opacity="0.6" />
        </g>
      </svg>
    </span>
    </span>
  );
}
