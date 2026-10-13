import { Scissors, CookingPot, Puzzle } from 'lucide-react';
import { getAbout, getInterests } from '@/lib/api';
import SectionLabel from './SectionLabel';
import Link from 'next/link';

const ICONS = {
  scissors: Scissors,
  'cooking-pot': CookingPot,
  puzzle: Puzzle,
};

/**
 * Concept: async Server Component for Home streaming.
 */
export default async function HomeBeyondPreview() {
  const [about, interests] = await Promise.all([getAbout(), getInterests()]);

  return (
    <section id="beyond" className="container-page py-24 sm:py-32">
      <SectionLabel number="04">Beyond code</SectionLabel>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="section-title">There is more to me than code.</h2>
        </div>
        <p className="max-w-xl leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
          {about.beyondLead}
        </p>
      </div>
      <div className="mt-12 grid border border-border sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => {
          const Icon = ICONS[interest.icon] || Puzzle;
          return (
            <article
              key={interest.id}
              className="border-b border-r border-border p-6 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <Icon className="mb-4 h-5 w-5 text-accent" aria-hidden />
              <h3 className="text-base font-semibold">{interest.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {interest.text}
              </p>
            </article>
          );
        })}
      </div>
      <Link
        href="/beyond-code"
        className="mt-6 inline-block text-sm text-primary hover:underline"
      >
        Beyond code page →
      </Link>
    </section>
  );
}