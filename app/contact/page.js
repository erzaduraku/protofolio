import ContactSection from '@/components/ContactSection';

export const metadata = {
  title: 'Contact',
  description: "Let's build something thoughtful — get in touch with Erza Duraku.",
};

/**
 * Concept: static route /contact — same premium ContactSection as Home.
 */
export default function ContactPage() {
  return (
    <div className="pb-8">
      <ContactSection headingLevel="h1" />
    </div>
  );
}