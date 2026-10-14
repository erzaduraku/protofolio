'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useMediaQuery, { FINE_POINTER_MOTION } from '@/lib/useMediaQuery';

/** Fine pointers with motion allowed only; never on touch. Text fields keep the native caret. */
const INTERACTIVE = 'a, button, [role="button"], summary, label[for]';
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]';
// Dark-green surfaces turn the dot cream. A light surface nested inside a dark one wins.
const DARK = '[data-cursor="light"], .on-ink, .bg-ink, .bg-ink-deep, .btn-ink';
const LIGHT = '[data-cursor="dark"], .bg-paper, .bg-paper-light, .bg-paper-deep, .bg-chalk';

function isOnDark(target) {
  const dark = target?.closest(DARK);
  if (!dark) return false;
  const light = target.closest(LIGHT);
  return !(light && dark.contains(light));
}

export default function PinCursor() {
  const enabled = useMediaQuery(FINE_POINTER_MOTION);
  const [mode, setMode] = useState('hidden'); // hidden | idle | link | text
  const [onDark, setOnDark] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 800, damping: 50, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 800, damping: 50, mass: 0.25 });

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add('pin-cursor');

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        setMode('hidden');
        return;
      }
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      setOnDark(isOnDark(target));
      if (target?.closest(TEXT_FIELD)) setMode('text');
      else if (target?.closest(INTERACTIVE)) setMode('link');
      else setMode('idle');
    };
    const onLeave = () => setMode('hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.classList.remove('pin-cursor');
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const visible = mode === 'idle' || mode === 'link';

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-90"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className={`-ml-1 -mt-1 h-2 w-2 rounded-full transition-colors duration-200 ${
          mode === 'link'
            ? onDark
              ? 'bg-paper/30 ring-1 ring-paper'
              : 'bg-chalk/60 ring-1 ring-ink'
            : onDark
              ? 'bg-paper'
              : 'bg-ink'
        }`}
        animate={{ opacity: visible ? 1 : 0, scale: mode === 'link' ? 4 : 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      />
    </motion.div>
  );
}
