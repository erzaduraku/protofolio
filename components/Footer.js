import { getContact } from '@/lib/api';

/**
 * Concept: reusable async Footer rendered once from layout.js.
 * A deep-green closing band (darker than the --ink sections, so it never
 * blends with the dark "Where I want to go" band) inside the site container:
 * - left: closing line + email
 * - right (top-aligned): LinkedIn / GitHub + small sign-off
 * - bottom row under a hairline: © + location, Back to top
 * The only tailoring accent is a thin red "thread" hairline on the top edge.
 * External links use <a target="_blank" rel="noopener noreferrer">.
 */
export default async function Footer() {
  const contact = await getContact();

  const links = [
    { id: 'linkedin', label: 'LinkedIn', href: contact.linkedin },
    { id: 'github', label: 'GitHub', href: contact.github },
  ];

  return (
    <footer className="on-ink relative border-t-2 border-thread bg-ink-deep text-paper">
      <div className="container-page py-16">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="display text-[clamp(1.75rem,2.6vw,2.25rem)]">
              Let&rsquo;s make something <em>careful</em>.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-block break-all text-lg text-paper underline decoration-chalk decoration-1 underline-offset-4 hover:decoration-2"
            >
              {contact.email}
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <ul className="space-y-2 text-base">
              {links.map((link) => (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-paper/85 hover:text-chalk">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-display text-sm italic text-paper/65">Designed between logic &amp; craft</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-6 text-sm text-paper/70">
          <p>
            © 2026 Erza Duraku <span aria-hidden="true" className="mx-2">·</span> {contact.location}
          </p>
          <a href="#main" className="text-paper/85 hover:text-chalk">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
