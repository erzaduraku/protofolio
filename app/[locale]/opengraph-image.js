import { ImageResponse } from 'next/og';
import { LOCALES, getDict } from '@/lib/i18n';

/**
 * Concept: dynamic Open Graph image (course lecture 62). Next serves this as the
 * share image for every page under [locale]. Text comes from lib/i18n.js (meta.title);
 * generateStaticParams keeps it static (built once, not on every request).
 */
export const alt = 'Erza Duraku';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({ params }) {
  // Next 16: params is a Promise
  const { locale } = await params;
  const t = getDict(locale).meta;
  // meta.title is "Erza Duraku - tagline": split it into name + tagline
  const [name, ...rest] = t.title.split(/\s[-\u2013\u2014]\s/);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: '#f4efe6', color: '#1c1a17' }}>
        <div style={{ fontSize: 96, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 44, marginTop: 24 }}>{rest.join(' - ')}</div>
      </div>
    ),
    size
  );
}
