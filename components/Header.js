import Link from 'next/link';
import NavLink from './NavLink';

/**
 * Concept: Server Component that composes a Client Component (NavLink).
 * Header itself does not need 'use client'.
 * Internal nav uses <Link>; never plain <a> for same-site routes.
 */
const links = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/journey', label: 'Journey' },
  { href: '/beyond-code', label: 'Beyond code' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-primary text-xs font-semibold text-foreground">
            ED
          </span>
          <span className="text-sm font-medium text-foreground">Erza Duraku</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}