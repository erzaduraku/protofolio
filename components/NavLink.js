'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Concept: small Client Component for interactive active-nav highlighting.
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
      className={
        isActive
          ? 'text-foreground text-xs font-medium'
          : 'text-muted-foreground text-xs font-medium transition-colors hover:text-foreground'
      }
    >
      {children}
    </Link>
  );
}