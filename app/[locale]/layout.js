import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Fraunces, Instrument_Sans, DM_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeasuringTape from '@/components/MeasuringTape';
import SmoothScroll from '@/components/SmoothScroll';
import PinCursor from '@/components/PinCursor';
import Thread from '@/components/Thread';
import RevealObserver from '@/components/RevealObserver';
import PaperGrain from '@/components/PaperGrain';
import ChatWidget from '@/components/ChatWidget';
import LocaleProvider from '@/components/LocaleProvider';
import { LOCALES, isLocale, getDict } from '@/lib/i18n';
import '../globals.css';

/** Concept: root layout per locale (/ = English, /sq = Albanian). Fonts via next/font (self-hosted at build time, no layout shift). */
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

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

// Runs before paint: enables the scroll-reveal start state only when JS runs
// and motion is allowed. Without JS (or with reduced motion) nothing is hidden.
const MOTION_BOOT =
  "try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready')}}catch(e){}";

// Public site address, used by metadataBase below.
const SITE_URL = 'https://protofolio-gamma-self.vercel.app';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDict(locale).meta;
  return {
    title: { default: t.title, template: '%s · Erza Duraku' },
    description: t.description,
    authors: [{ name: 'Erza Duraku' }],
    alternates: { languages: { en: '/', sq: '/sq' } },
    // Base URL so relative links (og:image, canonical) become absolute on social media.
    metadataBase: new URL(SITE_URL),
    // Open Graph: how the link looks when shared (LinkedIn, Facebook...). Image comes from opengraph-image.js.
    openGraph: {
      type: 'website',
      siteName: 'Erza Duraku',
      title: t.title,
      description: t.description,
      url: locale === 'sq' ? '/sq' : '/',
      locale: locale === 'sq' ? 'sq_AL' : 'en_US',
    },
    // Twitter/X card with a large image preview.
    twitter: { card: 'summary_large_image', title: t.title, description: t.description },
    // Let search engines index the site and follow links.
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrument.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        {/* next/script, not a raw <script>: React warns when a raw script tag is rendered on the client (EN/SQ switch remounts this layout). */}
        <Script id="motion-boot" strategy="beforeInteractive">
          {MOTION_BOOT}
        </Script>
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <LocaleProvider locale={locale}>
          <a href="#main" className="skip-link">
            {t.common.skip}
          </a>
          <MeasuringTape />
          <SmoothScroll />
          <PinCursor />
          <RevealObserver />
          <Header locale={locale} />
          <div className="relative flex-1">
            <Thread />
            <main id="main" className="relative pt-[calc(var(--tape-h)+var(--header-h))]">
              {children}
            </main>
          </div>
          <Footer locale={locale} />
          <PaperGrain />
          <ChatWidget />
        </LocaleProvider>
      </body>
    </html>
  );
}
