import { getContact } from '@/lib/api';

/**
 * Concept: reusable async Footer rendered once from layout.js.
 * External links use <a target="_blank" rel="noopener noreferrer">.
 */
export default async function Footer() {
  const contact = await getContact();

  const links = [
    { id: 'email', label: 'Email', href: `mailto:${contact.email}` },
    { id: 'linkedin', label: 'LinkedIn', href: contact.linkedin, external: true },
    { id: 'github', label: 'GitHub', href: contact.github, external: true },
  ];

  return (
    <footer className="relative border-t border-line-strong">
      <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-12">
        <p className="display text-[clamp(2rem,4.2vw,3.4rem)] lg:col-span-6">
          Designed between <em>logic</em> &amp; <em>craft</em>
        </p>
        <nav aria-label="Elsewhere" className="lg:col-span-3 lg:col-start-8">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="link-stitch text-lg"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 text-sm text-ink-soft lg:col-span-2 lg:text-right">
          <p>© 2026 Erza Duraku</p>
          <p>{contact.location}</p>
          <p className="pt-3">
            <a href="#main" className="link-stitch text-ink">
              Back to top ↗
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
