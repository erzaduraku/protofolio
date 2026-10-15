'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery, { REDUCED_MOTION } from '@/lib/useMediaQuery';
import LanguageToggle from './LanguageToggle';
import { getDict, stripLocale } from '@/lib/i18n';
import { useActiveSection } from '@/lib/sections';
import SectionLink from './SectionLink';

/** Hamburger + full-screen menu below md. Closes on link click, Esc and route change; locks scroll. */
export default function MobileMenu({ links, homeHref = '/', homeLabel = 'Home', locale = 'en' }) {
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(null);
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const id = useId();
  const menuId = `mobile-menu-${id}`;

  // Route change closes the menu (derived: the menu belongs to the page it was opened on).
  const isOpen = open && openedAt === pathname;

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    window.__lenis?.stop();
    panelRef.current?.querySelector('a')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === 'Tab' && panelRef.current) {
        // keep focus inside the menu (button + links)
        const items = [buttonRef.current, ...panelRef.current.querySelectorAll('a')].filter(Boolean);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prevOverflow;
      window.__lenis?.start();
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const path = stripLocale(pathname || '/');
  const isActive = (link) => {
    if (link.section) return path === '/' && activeSection === link.section;
    const target = stripLocale(link.href);
    return target === '/' ? path === '/' && !activeSection : path === target || path.startsWith(`${target}/`);
  };
  const nav = getDict(locale).nav;
  const t = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.2, 0.7, 0.2, 1] };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? nav.closeMenu : nav.openMenu}
        onClick={() => {
          if (isOpen) close(false);
          else {
            setOpenedAt(pathname);
            setOpen(true);
          }
        }}
        className="relative z-60 -mr-2 flex h-11 w-11 items-center justify-center text-ink"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-6">
          <span
            className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 motion-reduce:transition-none ${
              isOpen ? 'top-1.5 rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-thread transition-opacity duration-200 motion-reduce:transition-none ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 motion-reduce:transition-none ${
              isOpen ? 'top-1.5 -rotate-45' : 'top-3'
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={panelRef}
            id={menuId}
            key="menu"
            className="fixed inset-x-0 bottom-0 top-[calc(var(--tape-h)+var(--header-h))] z-40 overflow-y-auto bg-paper"
            initial={reducedMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12 }}
            transition={t}
          >
            <nav aria-label="Main" className="container-page relative py-10">
              <span aria-hidden="true" className="absolute left-4 top-10 bottom-10 w-0.5 bg-thread sm:left-6" />
              <ul className="space-y-1 pl-6">
                {[{ href: homeHref, label: homeLabel }, ...links].map((link, i) => {
                  const active = isActive(link);
                  const Item = link.section ? SectionLink : Link;
                  const extra = link.section ? { section: link.section, delay: 60 } : {};
                  return (
                    <motion.li
                      key={link.href}
                      initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={reducedMotion ? { duration: 0 } : { ...t, delay: 0.04 * i }}
                    >
                      <Item
                        href={link.href}
                        {...extra}
                        onClick={() => close(false)}
                        aria-current={active ? (link.section ? 'location' : 'page') : undefined}
                        className={`block py-2.5 font-display text-xl leading-snug ${
                          active ? 'italic text-thread' : 'text-ink'
                        }`}
                      >
                        {link.label}
                      </Item>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-10 border-t border-line-strong pt-6 pl-6">
                <LanguageToggle locale={locale} ariaLabel={nav.language} switchLabel={nav.switchTo} />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
