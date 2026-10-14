'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { getDict, localePath } from '@/lib/i18n';

/** Concept: custom 404 used by notFound(); reads the locale from the [locale] layout. */
export default function NotFound() {
  const locale = useLocale();
  const t = getDict(locale).notFound;
  return (
    <section className="container-page relative overflow-x-clip py-24 sm:py-32">
      <span aria-hidden="true" className="numeral block">404</span>
      <h1 className="display -mt-8 text-[clamp(2.4rem,5vw,4.4rem)]">
        {t.heading[0]}
        <em>{t.heading[1]}</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">{t.body}</p>
      <Link href={localePath(locale, '/')} className="btn-ink mt-10">
        {t.home} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
