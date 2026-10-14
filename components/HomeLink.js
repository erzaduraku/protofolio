'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, stripLocale } from '@/lib/i18n';

/**
 * Logo link to the Home hero. On "/" it scrolls to the top instead of navigating
 * (through Lenis when it is running, instantly for reduced motion). From other pages,
 * Next.js navigates to "/" and lands at the top.
 */
export default function HomeLink({ children, locale = 'en', ...props }) {
  const pathname = usePathname();
  const home = localePath(locale, '/');

  function onClick(e) {
    if (stripLocale(pathname || '/') !== '/' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = window.__lenis;
    if (lenis && !reduced) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    if (window.location.hash) window.history.replaceState(null, '', home);
  }

  return (
    <Link href={home} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
