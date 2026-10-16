'use client';

import { useEffect } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { getDict } from '@/lib/i18n';
import styles from './error.module.css';

/** Segment error UI for app/[locale]: shown when a page under it throws; reset() retries the render. */
export default function Error({ error, reset }) {
  const locale = useLocale();
  const t = getDict(locale).errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={`container-page ${styles.page}`}>
      <h1 className={`display ${styles.heading}`}>
        {t.heading[0]}
        <em>{t.heading[1]}</em>
      </h1>
      <p className={styles.body}>{t.body}</p>
      <button type="button" onClick={() => reset()} className={`btn-ink ${styles.retry}`}>
        {t.retry} <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}
