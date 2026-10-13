'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Scroll progress as a tailor's measuring tape across the top of the page.
 * Tick marks are CSS gradients; the thread fill grows with scaleX only.
 */
export default function MeasuringTape() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="tape fixed inset-x-0 top-0 z-60 h-(--tape-h) overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 origin-left bg-thread"
        style={{ scaleX: reducedMotion ? scrollYProgress : smooth }}
      />
      <div className="tape-ticks absolute inset-0" />
    </div>
  );
}
