'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Not started for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.12 });
    window.__lenis = lenis; // lets HomeLink scroll smoothly without a second scroller
    return () => {
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
