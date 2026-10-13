import ContactSection from '@/components/sections/ContactSection';

export const metadata = {
  title: 'Contact',
  description: "Let's build something thoughtful — get in touch with Erza Duraku.",
};

/** Concept: static route /contact — same ContactSection as Home. */
export default function ContactPage() {
  return <ContactSection headingLevel="h1" />;
}
