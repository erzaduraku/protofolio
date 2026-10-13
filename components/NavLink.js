'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Concept: small Client Component for active-nav highlighting.
 * Header stays a Server Component; only this leaf needs 'use client'
 * because usePathname requires the browser.
 */
export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive =
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

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
