import JourneySection from '@/components/sections/JourneySection';

export const metadata = {
  title: 'Journey',
  description: 'Experience, community volunteering, and learning timeline.',
};

/** Concept: static route /journey (with loading.js) showing full event write-ups. */
export default function JourneyPage() {
  return <JourneySection headingLevel="h1" showBody />;
}
