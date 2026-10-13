import { Fraunces, Instrument_Sans, DM_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeasuringTape from '@/components/MeasuringTape';
import SmoothScroll from '@/components/SmoothScroll';
import PinCursor from '@/components/PinCursor';
import Thread from '@/components/Thread';
import RevealObserver from '@/components/RevealObserver';
import PaperGrain from '@/components/PaperGrain';
import './globals.css';

/**
 * Concept: Root layout wraps every page (Header, Footer and the global
 * "atelier" layer: measuring tape, thread, pin cursor, paper grain).
 *
 * Fonts via next/font/google (self-hosted at build time, no layout shift):
 * - Fraunces: display serif, variable with opsz / SOFT / WONK axes + italics
 * - Instrument Sans: body
 * - DM Mono: a few small labels only
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

export const metadata = {
  title: {
    default: 'Erza Duraku — Software Engineer in the Making',
    template: '%s · Erza Duraku',
  },
  description:
    'Portfolio of Erza Duraku, a Software Engineering student building thoughtful software across full-stack development, AI, databases, and cloud.',
  authors: [{ name: 'Erza Duraku' }],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MeasuringTape />
        <SmoothScroll />
        <PinCursor />
        <RevealObserver />
        <Header />
        <div className="relative flex-1">
          <Thread />
          <main id="main" className="relative pt-[calc(var(--tape-h)+var(--header-h))]">
            {children}
          </main>
        </div>
        <Footer />
        <PaperGrain />
      </body>
    </html>
  );
}
