'use client';

import { useId } from 'react';
import styles from './ChatRobot.module.css';

// Cute chibi robot used as the chat launcher. Purely visual (aria-hidden);
// the surrounding <button> carries the label.
export default function ChatRobot() {
  const id = useId().replace(/:/g, '');
  const metal = `metal-${id}`;
  const metalBody = `metalBody-${id}`;
  const visor = `visor-${id}`;
  const glow = `glow-${id}`;
  const chest = `chest-${id}`;
  const shine = `shine-${id}`;
  return (
    <span className={styles.float} aria-hidden="true">
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
        <rect x="38" y="92" width="9" height="12" rx="3" fill={`url(#${metalBody})`} />
        <rect x="53" y="92" width="9" height="12" rx="3" fill={`url(#${metalBody})`} />
        <ellipse cx="42.5" cy="105" rx="7" ry="3.5" fill="#5f6873" />
        <ellipse cx="57.5" cy="105" rx="7" ry="3.5" fill="#5f6873" />

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
          <g className={styles.eyes} filter={`url(#${glow})`}>
            <circle cx="40" cy="44" r="5.5" fill="#bff8ff" />
            <circle cx="60" cy="44" r="5.5" fill="#bff8ff" />
            <circle cx="41.5" cy="42.5" r="1.8" fill="#ffffff" />
            <circle cx="61.5" cy="42.5" r="1.8" fill="#ffffff" />
          </g>
          <ellipse cx="38" cy="22" rx="10" ry="5" fill="#ffffff" opacity="0.6" />
        </g>
      </svg>
    </span>
  );
}
