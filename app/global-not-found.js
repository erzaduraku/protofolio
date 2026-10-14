import Link from 'next/link';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';

/**
 * 404 for URLs that match no route. The root layout lives in app/[locale], so
 * Next.js renders this page without it; the page itself carries both languages.
 * (Requires experimental.globalNotFound in next.config.mjs.)
 */
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

const instrument = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: '404 · Erza Duraku',
  description: 'Page not found. Faqja nuk u gjet.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <main className="container-page relative overflow-x-clip py-24 sm:py-32">
          <span aria-hidden="true" className="numeral block">404</span>
          <h1 className="display -mt-8 text-[clamp(2.4rem,5vw,4.4rem)]">
            Page <em>not found</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            That page doesn&rsquo;t exist — or the project isn&rsquo;t published yet.
          </p>
          <div lang="sq" className="mt-10 border-l-2 border-thread pl-5">
            <p className="display text-[clamp(1.8rem,3.4vw,2.8rem)]">
              Faqja <em>nuk u gjet</em>
            </p>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Kjo faqe nuk ekziston — ose projekti nuk është publikuar ende.
            </p>
          </div>
          <p className="mt-12 flex flex-wrap gap-3">
            <Link href="/" className="btn-ink">
              Back home <span aria-hidden="true">→</span>
            </Link>
            <Link href="/sq" lang="sq" className="btn-line">
              Kthehu në ballinë <span aria-hidden="true">→</span>
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
