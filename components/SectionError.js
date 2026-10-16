import styles from './SectionError.module.css';
import { getDict } from '@/lib/i18n';

/** Shown by <ErrorBoundary> when one Home section fails; the rest of the page keeps working. */
export default function SectionError({ locale = 'en' }) {
  return (
    <div className={`container-page ${styles.wrap}`}>
      <p role="status" className={styles.note}>
        {getDict(locale).errorPage.section}
      </p>
    </div>
  );
}
