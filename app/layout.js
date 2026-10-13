import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

/**
 * Concept: Root layout wraps every page.
 * Header and Footer are extracted components rendered here once.
 * Inter (sans) + JetBrains Mono (labels) via next/font — matches the blueprint design.
 */
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

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
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}