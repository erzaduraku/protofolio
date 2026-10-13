import { getJourney } from '@/lib/api';
import SectionLabel from './SectionLabel';
import CommunityEvents from './EventCard';
import Link from 'next/link';
import { Handshake } from 'lucide-react';

/**
 * Concept: separate async Server Component fetching its own data
 * (Home page streams multiple sections independently).
 * Digi Camp = featured photo bento; SFK / DevFest = text-only cards.
 */
export default async function CurrentlyCard() {
  const { learning, volunteering } = await getJourney();

  return (
    <section id="journey" className="container-page py-24 sm:py-32">
      <SectionLabel number="03">Journey &amp; experience</SectionLabel>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="section-title">Learning beyond the classroom.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            University built the foundation. Work, training, and community taught
            me how software lives in the real world.
          </p>
        </div>
        <div className="lg:col-span-7">
          <ol className="timeline-rail relative ml-2 space-y-0">
            {learning.map((item) => (
              <li key={item.id} className="relative pb-12 pl-8 last:pb-0">
                <span className="timeline-dot" aria-hidden />
                <p className="mono-caps text-primary">{item.year}</p>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                  {item.title}
                </h3>
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

      <div className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mono-caps text-primary">Outside the code</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Community taught me to show up.
            </h3>
          </div>
          <Handshake className="hidden h-10 w-10 text-primary sm:block" aria-hidden />
        </div>

        <CommunityEvents events={volunteering} />

        <Link
          href="/journey"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          Full journey page â†’
        </Link>
      </div>
    </section>
  );
}