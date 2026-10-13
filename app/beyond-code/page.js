import { Scissors, CookingPot, Puzzle } from 'lucide-react';
import { getAbout, getInterests, getPurpose } from '@/lib/api';
import SectionLabel from '@/components/SectionLabel';

const ICONS = {
  scissors: Scissors,
  'cooking-pot': CookingPot,
  puzzle: Puzzle,
};

export const metadata = {
  title: 'Beyond Code',
  description: 'Things that shape how I think — beyond software.',
};

/**
 * Concept: static route /beyond-code.
 */
export default async function BeyondCodePage() {
  const [about, interests, purpose] = await Promise.all([
    getAbout(),
    getInterests(),
    getPurpose(),
  ]);

  const lastIndex = purpose.paragraphs.length - 1;

  return (
    <div className="container-page space-y-14 py-16 sm:py-24">
      <section>
        <SectionLabel number="04">Beyond code</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-12">
          <h1 className="section-title lg:col-span-5">
            There is more to me than code.
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
            {about.beyondLead}
          </p>
        </div>
      </section>

      <div className="grid border border-border sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => {
          const Icon = ICONS[interest.icon] || Puzzle;
          return (
            <article
              key={interest.id}
              className="border-b border-r border-border p-6 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <Icon className="mb-4 h-5 w-5 text-accent" aria-hidden />
              <h2 className="text-base font-semibold">{interest.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {interest.text}
              </p>
            </article>
          );
        })}
      </div>

      <section>
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
    </div>
  );
}