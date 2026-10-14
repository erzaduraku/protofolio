import Link from 'next/link';
import NavLink from './NavLink';

/** Concept: Server Component composing a Client Component (NavLink). */
const links = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/journey', label: 'Journey' },
  { href: '/beyond-code', label: 'Beyond code' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-(--tape-h) z-50 h-(--header-h) border-b border-line-strong bg-paper">
      <div className="container-page flex h-full items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-baseline gap-1.5 text-ink" aria-label="Erza Duraku, home">
          <span className="font-display text-[1.35rem] italic leading-none">Erza</span>
          <span className="font-display text-[1.35rem] leading-none">Duraku</span>
          <span aria-hidden="true" className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-thread" />
        </Link>
        <nav aria-label="Main" className="-mr-2 min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-0.5 whitespace-nowrap sm:gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
