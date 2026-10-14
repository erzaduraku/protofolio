import { getDict } from '@/lib/i18n';
import ContactSection from '@/components/sections/ContactSection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getDict(locale).meta.contact;
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  return <ContactSection locale={locale} headingLevel="h1" />;
}
