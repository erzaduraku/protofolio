'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, stripLocale } from '@/lib/i18n';

/**
 * EN / SQ switch. Links to the same path in the other language. The URL alone
 * decides the locale ("/sq/..." is Albanian, everything else English).
 */
export default function LanguageToggle({ locale, ariaLabel, switchLabel, className = '' }) {
  const pathname = usePathname() || '/';
  const path = stripLocale(pathname);
  const enHref = localePath('en', path);
  const sqHref = localePath('sq', path);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 font-display text-sm ${className}`}
    >
      <Link
        href={enHref}
        hrefLang="en"
        lang="en"
        aria-current={locale === 'en' ? 'true' : undefined}
        aria-label={locale === 'sq' ? switchLabel : undefined}
        className={locale === 'en' ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'}
      >
        EN
      </Link>
      <span aria-hidden="true" className="text-ink-soft">
        /
      </span>
      <Link
        href={sqHref}
        hrefLang="sq"
        lang="sq"
        aria-current={locale === 'sq' ? 'true' : undefined}
        aria-label={locale === 'en' ? switchLabel : undefined}
        className={locale === 'sq' ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'}
      >
        SQ
      </Link>
    </div>
  );
}
