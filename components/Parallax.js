'use client';

import { useEffect, useRef } from 'react';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';

/**
 * Light scroll parallax for photos: shifts children a few pixels vertically
 * depending on their position in the viewport. Transform only, rAF-throttled,
 * idle while off-screen, disabled for reduced motion.
 */
export default function Parallax({ children, strength = 14, className = '' }) {
  const ref = useRef(null);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reducedMotion) {
      el.style.transform = '';
      return undefined;
    }
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / vh));
      el.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}px, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
