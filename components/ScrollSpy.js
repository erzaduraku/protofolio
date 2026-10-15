'use client';

import { useEffect } from 'react';
import { NAV_SECTIONS, scrollToSection, sectionTop, setActiveSection } from '@/lib/sections';

// Sections that don't have their own nav item count as the one they belong to.
const OWNER = { top: null, purpose: 'beyond-code' };
const WATCH = ['top', ...NAV_SECTIONS.slice(0, 4), 'purpose', 'contact'];

/**
 * Home only. Highlights the nav item of the section in view (IntersectionObserver on a
 * band around the upper middle of the viewport) and, when Home is opened with a hash
 * (e.g. from a project page), scrolls to that section once it has streamed in.
 */
export default function ScrollSpy() {
  useEffect(() => {
    const visible = new Set();
    const observed = new Set();
    const update = () => {
      const current = WATCH.filter((id) => visible.has(id)).pop();
      if (current === undefined) return;
      setActiveSection(current in OWNER ? OWNER[current] : current);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        update();
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    // Sections stream in through Suspense, so keep looking until all are observed.
    const attach = () => {
      WATCH.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observed.has(id)) {
          observed.add(id);
          io.observe(el);
        }
      });
      return observed.size === WATCH.length;
    };
    let tries = 0;
    const attachTimer = attach() ? null : setInterval(() => {
      if (attach() || ++tries > 60) clearInterval(attachTimer);
    }, 200);

    // Arriving with "#section": wait for it to render, then scroll with the header offset.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    let hashTimer = null;
    if (NAV_SECTIONS.includes(hash)) {
      let hashTries = 0;
      // Keep re-aligning for a moment: sections above may still stream in and push it down.
      let settled = 0;
      const tryScroll = () => {
        const el = document.getElementById(hash);
        if (el) {
          const drift = Math.abs(sectionTop(el) - window.scrollY);
          if (drift > 2) {
            settled = 0;
            window.__lenis?.resize?.();
            scrollToSection(hash, { immediate: true });
          } else if (++settled >= 5) {
            setActiveSection(hash);
            return true;
          }
          setActiveSection(hash);
        }
        return ++hashTries > 60;
      };
      if (!tryScroll()) {
        hashTimer = setInterval(() => {
          if (tryScroll()) clearInterval(hashTimer);
        }, 100);
      }
    }

    return () => {
      io.disconnect();
      if (attachTimer) clearInterval(attachTimer);
      if (hashTimer) clearInterval(hashTimer);
      setActiveSection(null);
    };
  }, []);

  return null;
}
