import { getContact } from '@/lib/api';

/**
 * Concept: reusable Footer component rendered from layout.js.
 * External links use <a target="_blank" rel="noopener noreferrer">.
 */
export default async function Footer() {
  const contact = await getContact();

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>© 2026 Erza Duraku</p>
          <p className="text-xs">{contact.location}</p>
        </div>
        <p className="mono-caps text-center">Designed between logic &amp; craft</p>
        <div className="flex flex-wrap gap-4 sm:justify-end">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-primary"
          >
            Email
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            GitHub
          </a>
          <a href="#top" className="hover:text-foreground">
            Back to top ↗
          </a>
        </div>
      </div>
    </footer>
  );
}