'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/i18n';
import { useActiveSection } from '@/lib/sections';
import SectionLink from './SectionLink';

/** Header link. With `section`, it points at a Home section and is active while that section is in view. */
export default function NavLink({ href, section, children }) {
  const pathname = stripLocale(usePathname() || '/');
  const activeSection = useActiveSection();
  const target = stripLocale(href);
  const isActive = section
    ? pathname === '/' && activeSection === section
    : target === '/'
      ? pathname === '/'
      : pathname === target || pathname.startsWith(`${target}/`);

  const className = `inline-block px-2 py-2 text-[0.9rem] ${
    isActive ? 'nav-link-active text-ink' : 'text-ink-soft hover:text-ink'
  }`;

  if (section) {
    return (
      <SectionLink href={href} section={section} aria-current={isActive ? 'location' : undefined} className={className}>
        {children}
      </SectionLink>
    );
  }
  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}
