import { getContact } from '@/lib/api';
import { emphasize } from '@/lib/emphasize';
import ContactForm from '@/components/ContactForm';
import { IconMail, IconPhone, IconMapPin, IconLinkedin, IconGithub } from '@/components/SocialIcons';

/**
 * Contact: oversized heading, details as a ruled list on the left,
 * and the form on a lifted paper sheet pinned to the page on the right.
 * Concept: Server Component composing data + the client ContactForm.
 */
export default async function ContactSection({ headingLevel = 'h2' }) {
  const contact = await getContact();
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';

  const rows = [
    { id: 'email', kind: 'Email', label: contact.email, href: `mailto:${contact.email}`, Icon: IconMail },
    { id: 'phone', kind: 'Phone', label: contact.phone, href: contact.phoneHref, Icon: IconPhone },
    { id: 'location', kind: 'Based in', label: contact.location, href: null, Icon: IconMapPin },
    { id: 'linkedin', kind: 'LinkedIn', label: contact.linkedinLabel, href: contact.linkedin, external: true, Icon: IconLinkedin },
    { id: 'github', kind: 'GitHub', label: contact.githubLabel, href: contact.github, external: true, Icon: IconGithub },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="container-page relative">
        <span aria-hidden="true" className="numeral absolute -top-6 right-2 sm:-top-14">06</span>
        <p className="kicker relative">Contact</p>
        <Heading id="contact-heading" className="display relative mt-5 max-w-5xl text-[clamp(2.7rem,7.4vw,6.75rem)]">
          {emphasize(contact.heading, ['thoughtful'])}
        </Heading>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="max-w-md text-lg text-ink-soft">{contact.body}</p>
            <ul className="mt-10 divide-y divide-line-strong border-y border-line-strong">
              {rows.map(({ id, kind, label, href, external, Icon }) => (
                <li key={id} className="grid grid-cols-[1.5rem_1fr] items-start gap-3 py-3.5">
                  <Icon className="mt-1 h-4 w-4 text-ink" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{kind}</p>
                    {href ? (
                      <a
                        href={href}
                        className="link-stitch wrap-break-word"
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {label}
                      </a>
                    ) : (
                      <p>{label}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-7 lg:mt-6">
            {/* decorative pin */}
            <svg aria-hidden="true" className="absolute -top-5 left-10 z-10 h-12 w-12" viewBox="0 0 48 48" fill="none">
              <path d="M10 40 L34 14" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="37" cy="11" r="7" fill="var(--thread)" stroke="var(--ink)" strokeWidth="1.2" />
              <circle cx="35" cy="9" r="2" fill="var(--paper-light)" />
            </svg>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
