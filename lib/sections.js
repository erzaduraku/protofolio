'use client';

import { useSyncExternalStore } from 'react';

/** Home sections reachable from the main nav (one-page scroll). */
export const NAV_SECTIONS = ['about', 'projects', 'journey', 'beyond-code', 'contact'];

// Active section shared by the header links, the mobile menu and the ScrollSpy.
let active = null;
const subscribers = new Set();

export function setActiveSection(id) {
  if (id === active) return;
  active = id;
  subscribers.forEach((notify) => notify());
}

function subscribe(notify) {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
}

export function useActiveSection() {
  return useSyncExternalStore(subscribe, () => active, () => null);
}

/** Header offset: the html scroll-padding-top (tape + sticky header + a little air). */
function headerOffset() {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

/** Scroll position that puts the section just under the sticky header. */
export function sectionTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  return Math.max(0, top - headerOffset());
}

/** Scrolls to a Home section through Lenis (or natively for reduced motion). Returns false if it isn't rendered yet. */
export function scrollToSection(id, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Layout position (offsetTop chain), so reveal transforms in progress don't skew the target.
  const top = sectionTop(el);
  const lenis = window.__lenis;
  if (lenis && !reduced) {
    // Lazy images can shift the layout during the glide; re-aim once it lands (at most twice).
    let corrections = 0;
    const land = () => {
      const target = sectionTop(el);
      if (Math.abs(target - window.scrollY) > 2 && corrections++ < 2) lenis.scrollTo(target, { onComplete: land });
    };
    lenis.scrollTo(top, { immediate, onComplete: land });
  } else {
    window.scrollTo({ top, behavior: reduced || immediate ? 'auto' : 'smooth' });
  }
  return true;
}
