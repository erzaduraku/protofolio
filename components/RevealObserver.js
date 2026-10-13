'use client';

import { useEffect } from 'react';

/**
 * Reveal-on-scroll for every <section> in <main> (and anything with data-reveal).
 * One shared IntersectionObserver; a MutationObserver picks up sections that
 * stream in later through <Suspense> or arrive with client-side navigation.
 *
 * Hydration-safe: this never touches DOM attributes or classes (streamed
 * sections may not be hydrated yet, and changed attributes would cause a
 * mismatch). "Already watched" is tracked in a WeakSet, and the reveal itself
 * is a Web Animations API animation (fill: forwards) layered over the CSS
 * start state, so React's markup stays exactly as rendered on the server.
 *
 * The hidden start state only applies when <html> has .motion-ready (set by the
 * inline boot script in layout.js). Without JS or with reduced motion,
 * everything is simply visible.
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
