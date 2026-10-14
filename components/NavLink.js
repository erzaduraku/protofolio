'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/i18n';

/** Only this leaf is a Client Component, because usePathname needs the browser. */
export default function NavLink({ href, children }) {
  const pathname = stripLocale(usePathname() || '/');
  const target = stripLocale(href);
  const isActive =
    target === '/'
      ? pathname === '/'
      : pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`inline-block px-2 py-2 text-[0.9rem] ${
        isActive ? 'nav-link-active text-ink' : 'text-ink-soft hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}
