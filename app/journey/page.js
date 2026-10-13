import { Handshake } from 'lucide-react';
import { getJourney } from '@/lib/api';
import SectionLabel from '@/components/SectionLabel';
import CommunityEvents from '@/components/EventCard';

export const metadata = {
  title: 'Journey',
  description: 'Experience, community volunteering, and learning timeline.',
};

/**
 * Concept: static route /journey that fetches bundled journey data.
 * Digi Camp = featured photo bento; SFK / DevFest = text-only cards (no empty grids).
 */
export default async function JourneyPage() {
  const { volunteering, volunteeringQuote, learning } = await getJourney();

  return (
    <div className="container-page space-y-20 py-16 sm:py-24">
      <section>
        <SectionLabel number="03">Journey &amp; experience</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="section-title">Learning beyond the classroom.</h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              University built the foundation. Work, training, and community taught
              me how software lives in the real world.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ol className="timeline-rail relative ml-2">
              {learning.map((item) => (
                <li key={item.id} className="relative pb-12 pl-8 last:pb-0">
                  <span className="timeline-dot" aria-hidden />
                  <p className="mono-caps text-primary">{item.year}</p>
                  <h2 className="mt-3 text-xl font-semibold sm:text-2xl">
                    {item.title}
                  </h2>
                  {item.place ? (
                    <p className="mono-caps mt-1 text-muted-foreground">
                      {item.place}
                    </p>
                  ) : null}
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                  {item.chips?.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.chips.map((chip) => (
                        <span
                          key={chip}
                          className="border border-border px-2 py-1 text-xs text-muted-foreground"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mono-caps text-primary">Outside the code</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Community taught me to show up.
            </h2>
          </div>
          <Handshake className="hidden h-10 w-10 text-primary sm:block" aria-hidden />
        </div>

        <CommunityEvents events={volunteering} showTags showDigiBody />

        <blockquote className="mt-12 border-l-2 border-primary pl-5">
          <p className="text-xl leading-relaxed text-foreground">
            &ldquo;{volunteeringQuote.quote}&rdquo;
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {volunteeringQuote.reflection}
          </p>
        </blockquote>
      </section>
    </div>
  );
}