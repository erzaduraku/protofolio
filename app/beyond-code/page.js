import BeyondSection from '@/components/sections/BeyondSection';
import PurposeSection from '@/components/sections/PurposeSection';

export const metadata = {
  title: 'Beyond Code',
  description: 'Things that shape how I think — beyond software.',
};

export default function BeyondCodePage() {
  return (
    <>
      <BeyondSection headingLevel="h1" />
      <PurposeSection />
      {/* paper gap so the dark purpose band doesn't run straight into the footer */}
      <div aria-hidden="true" className="h-16 sm:h-24" />
    </>
  );
}
