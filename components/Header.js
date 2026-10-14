import HomeLink from './HomeLink';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';
import LanguageToggle from './LanguageToggle';
import { getDict, localePath } from '@/lib/i18n';

/** Concept: Server Component composing Client Components (NavLink, MobileMenu, LanguageToggle). */
export default function Header({ locale = 'en' }) {
  const t = getDict(locale).nav;
  const links = [
    { href: localePath(locale, '/about'), label: t.about },
    { href: localePath(locale, '/projects'), label: t.projects },
    { href: localePath(locale, '/journey'), label: t.journey },
    { href: localePath(locale, '/beyond-code'), label: t.beyond },
    { href: localePath(locale, '/cv'), label: t.cv },
    { href: localePath(locale, '/contact'), label: t.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-(--tape-h) z-50 h-(--header-h) border-b border-line-strong bg-paper">
      <div className="container-page flex h-full items-center justify-between gap-4">
        <HomeLink
          locale={locale}
          className="flex shrink-0 items-baseline gap-1.5 text-ink"
          aria-label={t.homeAria}
        >
          <span className="font-display text-[1.15rem] sm:text-[1.35rem] italic leading-none">Erza</span>
          <span className="font-display text-[1.15rem] sm:text-[1.35rem] leading-none">Duraku</span>
          <span aria-hidden="true" className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-thread" />
        </HomeLink>
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <nav aria-label={t.label} className="-mr-1 min-w-0">
            <ul className="flex items-center gap-0.5 whitespace-nowrap sm:gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageToggle locale={locale} ariaLabel={t.language} switchLabel={t.switchTo} />
        </div>
        <div className="md:hidden">
          <MobileMenu links={links} homeHref={localePath(locale, '/')} homeLabel={t.home} locale={locale} />
        </div>
      </div>
    </header>
  );
}
