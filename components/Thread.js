'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * A red thread sewn down the left margin of the page, connecting the
 * sections. It follows a faint dashed stitch guide and is drawn with
 * pathLength tied to scroll progress (Framer useScroll).
 *
 * - The SVG is sized in real pixels to the page height (ResizeObserver),
 *   so the curve never stretches.
 * - Hidden below lg, where the margin is too narrow.
 * - Reduced motion: the full thread is shown, not animated.
 */
const WIDTH = 40;

function buildPath(height) {
  const mid = WIDTH / 2;
  const amp = 12;
  const step = 460;
  let d = `M ${mid} 0`;
  let y = 0;
  let dir = 1;
  while (y < height) {
    const next = Math.min(height, y + step);
    const span = next - y;
    const cx = mid + amp * dir;
    d += ` C ${cx} ${y + span * 0.33}, ${cx} ${y + span * 0.66}, ${mid} ${next}`;
    y = next;
    dir *= -1;
  }
  return d;
}

export default function Thread() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const length = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      setHeight(Math.round(entry.contentRect.height));
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const d = height > 0 ? buildPath(height) : '';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20 hidden lg:block"
      style={{
        width: WIDTH,
        left: 'max(0.25rem, calc(50% - 38rem - 2.75rem))',
      }}
    >
      {height > 0 ? (
        <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} fill="none">
          <path d={d} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="5 7" />
          <motion.path
            d={d}
            stroke="var(--thread)"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ pathLength: reducedMotion ? 1 : length }}
          />
        </svg>
      ) : null}
    </div>
  );
}
