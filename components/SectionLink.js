'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/i18n';
import { scrollToSection, setActiveSection } from '@/lib/sections';

/**
 * Link to a Home section ("/#about", "/sq#about"). On Home it scrolls smoothly with the
 * header offset; from other pages Next.js navigates to Home and ScrollSpy scrolls there.
 * `delay` lets the mobile menu close (and unlock scrolling) before scrolling.
 */
export default function SectionLink({ href, section, delay = 0, onClick, children, ...props }) {
  const pathname = usePathname();

  function handleClick(e) {
    onClick?.(e);
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (stripLocale(pathname || '/') !== '/') return;
    e.preventDefault();
    e.stopPropagation(); // keep Lenis' own anchor handler out of it
    const go = () => {
      if (scrollToSection(section)) {
        window.history.pushState(null, '', href);
        setActiveSection(section);
      }
    };
    if (delay) setTimeout(go, delay);
    else go();
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
