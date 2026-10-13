import { getPurpose } from '@/lib/api';
import SectionLabel from './SectionLabel';

/**
 * Concept: async Server Component fetching its own data (Home streaming).
 * Section 05 — Where I want to go (placed after Beyond code, before Contact).
 */
export default async function HomePurposePreview() {
  const purpose = await getPurpose();
  const lastIndex = purpose.paragraphs.length - 1;

  return (
    <section id="purpose" className="container-page py-24 sm:py-32">
      <SectionLabel number="05">{purpose.label}</SectionLabel>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="section-title">{purpose.heading}</h2>
        </div>
        <div className="space-y-5 lg:col-span-7">
          {purpose.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 56)}
              className={
                i === lastIndex
                  ? 'max-w-[65ch] border-l-2 border-primary pl-5 leading-relaxed text-foreground'
                  : 'max-w-[65ch] leading-relaxed text-muted-foreground'
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}