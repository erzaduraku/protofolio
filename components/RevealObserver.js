'use client';

import { useEffect } from 'react';

/**
 * Hydration-safe: never changes DOM attributes or classes (streamed sections may
 * not be hydrated yet). Watched elements live in a WeakSet and reveals use the
 * Web Animations API. The hidden start state only applies with html.motion-ready.
 */
const SELECTOR = 'main section:not([data-no-reveal]), main [data-reveal]';
const KEYFRAMES = [
  { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
  { opacity: 1, transform: 'none' },
];
const TIMING = { duration: 800, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' };

export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('motion-ready')) return undefined;

    const main = document.querySelector('main');
    if (!main || !('IntersectionObserver' in window) || !Element.prototype.animate) {
      root.classList.remove('motion-ready');
      return undefined;
    }

    const watched = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.animate(KEYFRAMES, TIMING);
            io.unobserve(entry.target); // reveal once
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );

    const scan = () => {
      main.querySelectorAll(SELECTOR).forEach((el) => {
        if (!watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
