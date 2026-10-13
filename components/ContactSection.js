import { getContact } from '@/lib/api';
import SectionLabel from './SectionLabel';
import ContactForm from './ContactForm';

/**
 * Concept: Server Component composing contact data + client ContactForm.
 * Layout: intro → compact mono chips → full-width form card (blueprint style).
 */
export default async function ContactSection({
  headingLevel = 'h2',
  showPageLink = false,
}) {
  const contact = await getContact();
  const HeadingTag = headingLevel === 'h1' ? 'h1' : 'h2';

  const chips = [
    { id: 'email', label: contact.email, href: `mailto:${contact.email}` },
    {
      id: 'student',
      label: contact.studentEmail,
      href: `mailto:${contact.studentEmail}`,
    },
    { id: 'phone', label: contact.phone, href: contact.phoneHref },
    { id: 'location', label: contact.location, href: null },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: contact.linkedin,
      external: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: contact.github,
      external: true,
    },
  ];

  return (
    <section id="contact" className="container-page py-24 sm:py-32">
      <SectionLabel number="06">Contact</SectionLabel>

      <div className="max-w-3xl">
        <HeadingTag className="section-title">{contact.heading}</HeadingTag>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {contact.body}
        </p>
      </div>

      {/* Compact mono chips — less icon noise than a long list */}
      <div className="mt-10 flex flex-wrap gap-2 border-y border-border py-5">
        {chips.map((chip) => {
          const className =
            'mono-caps border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary';
          if (!chip.href) {
            return (
              <span key={chip.id} className={className}>
                {chip.label}
              </span>
            );
          }
          return (
            <a
              key={chip.id}
              href={chip.href}
              {...(chip.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={className}
            >
              {chip.label}
            </a>
          );
        })}
      </div>

      <div className="mt-12 max-w-2xl">
        <p className="mono-caps mb-4 text-primary">Send a message</p>
        <ContactForm />
      </div>

      {showPageLink ? (
        <a
          href="/contact"
          className="mt-8 inline-block text-sm text-primary hover:underline"
        >
          Open contact page →
        </a>
      ) : null}
    </section>
  );
}