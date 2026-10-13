import BeyondSection from '@/components/sections/BeyondSection';
import PurposeSection from '@/components/sections/PurposeSection';

export const metadata = {
  title: 'Beyond Code',
  description: 'Things that shape how I think — beyond software.',
};

/** Concept: static route /beyond-code: hobbies + "Where I want to go". */
export default function BeyondCodePage() {
  return (
    <>
      <BeyondSection headingLevel="h1" />
      <PurposeSection />
    </>
  );
}
