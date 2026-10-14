import { getDict } from '@/lib/i18n';
import JourneySection from '@/components/sections/JourneySection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getDict(locale).meta.journey;
}

/** Concept: static route /journey with its own loading.js. */
export default async function JourneyPage({ params }) {
  const { locale } = await params;
  return <JourneySection locale={locale} headingLevel="h1" showBody />;
}
