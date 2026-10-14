import { getDict } from '@/lib/i18n';
import AboutSection from '@/components/sections/AboutSection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getDict(locale).meta.about;
}

/** Concept: static route /about; the section is an async Server Component. */
export default async function AboutPage({ params }) {
  const { locale } = await params;
  return <AboutSection locale={locale} headingLevel="h1" showSkills />;
}
