import { getDict } from '@/lib/i18n';
import BeyondSection from '@/components/sections/BeyondSection';
import PurposeSection from '@/components/sections/PurposeSection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getDict(locale).meta.beyond;
}

export default async function BeyondCodePage({ params }) {
  const { locale } = await params;
  return (
    <>
      <BeyondSection locale={locale} headingLevel="h1" />
      <PurposeSection locale={locale} />
      {/* paper gap so the dark purpose band doesn't run straight into the footer */}
      <div aria-hidden="true" className="h-16 sm:h-24" />
    </>
  );
}
