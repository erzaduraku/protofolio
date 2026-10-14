import JourneySection from '@/components/sections/JourneySection';

export const metadata = {
  title: 'Journey',
  description: 'Experience, community volunteering, and learning timeline.',
};

/** Concept: static route /journey with its own loading.js. */
export default function JourneyPage() {
  return <JourneySection headingLevel="h1" showBody />;
}
