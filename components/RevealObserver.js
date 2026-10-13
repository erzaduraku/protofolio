'use client';

import { useEffect } from 'react';

/**
 * Reveal-on-scroll for every <section> in <main> (and anything with data-reveal).
 * One shared IntersectionObserver; a MutationObserver picks up sections that
 * stream in later through <Suspense> or arrive with client-side navigation.
 *
 * The hidden start state only applies when <html> has .motion-ready (set by the
 * inline boot script in layout.js). Without JS or with reduced motion,
 * everything is simply visible.
 */
const SELECTOR = 'main section:not([data-no-reveal]), main [data-reveal]';

export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('motion-ready')) return undefined;

    const main = document.querySelector('main');
    if (!main || !('IntersectionObserver' in window)) {
      root.classList.remove('motion-ready');
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target); // reveal once
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );

    const scan = () => {
      main.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('is-revealed') && !el.dataset.revealWatched) {
          el.dataset.revealWatched = 'true';
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
