import { Wrench, Scissors } from 'lucide-react';
import { getAbout, getSkills } from '@/lib/api';
import { emphasize } from '@/lib/emphasize';

/**
 * About: the two-worlds story (mechanic father, tailor mother).
 * Composition: heading left with the lead floating low on the right,
 * two overlapping fabric swatches, a two-column text block, and a
 * wide pull quote. /about adds the tools "measurement chart".
 * Concept: async Server Component that fetches its own data.
 */
export default async function AboutSection({ headingLevel = 'h2', showSkills = false }) {
  const [about, skills] = await Promise.all([
    getAbout(),
    showSkills ? getSkills() : Promise.resolve([]),
  ]);
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  const SubHeading = headingLevel === 'h1' ? 'h2' : 'h3';
  const [first, second, ...rest] = about.paragraphs;

  return (
    <section id="about" aria-labelledby="about-heading" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="container-page relative">
        <span aria-hidden="true" className="numeral absolute -top-4 right-3 sm:-top-12">
          01
        </span>

        <div className="relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="kicker">About</p>
            <Heading id="about-heading" className="display mt-5 text-[clamp(2.4rem,5.4vw,4.75rem)]">
              {emphasize(about.heading, ['two worlds'])}
            </Heading>
          </div>
          <p className="display-italic max-w-sm text-[1.6rem] leading-snug lg:col-span-4 lg:mt-48">
            {about.lead}
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Two worlds: overlapping swatches */}
          <div className="relative mx-auto h-75 w-full max-w-88 lg:col-span-4 lg:mx-0">
            <div className="sheet-shadow absolute left-0 top-0 w-[72%] -rotate-3 bg-paper-deep p-6">
              <Wrench className="h-6 w-6 text-ink" aria-hidden="true" strokeWidth={1.5} />
              <p className="mt-12 font-display text-[1.65rem] leading-tight">{about.logicCard}</p>
            </div>
            <div
              className="on-ink sheet-shadow absolute bottom-0 right-0 w-[72%] rotate-2 bg-ink p-6 text-paper"
              style={{ '--notch': 'var(--paper)' }}
            >
              <Scissors className="h-6 w-6 text-thread" aria-hidden="true" strokeWidth={1.5} />
              <p className="mt-12 font-display text-[1.65rem] italic leading-tight">{about.craftCard}</p>
            </div>
          </div>

          <div className="text-ink-soft sm:columns-2 sm:gap-10 lg:col-span-7 lg:col-start-6 [&>p]:mb-6 [&>p]:break-inside-avoid">
            {first ? <p className="drop-cap">{first}</p> : null}
            {second ? <p>{second}</p> : null}
          </div>
        </div>

        {about.motto ? (
          <figure className="mt-14 max-w-3xl border-l-2 border-thread pl-6 lg:ml-[33%]">
            <blockquote className="display-italic text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.1] text-ink">
              {about.motto}
            </blockquote>
            {about.mottoLabel ? (
              <figcaption className="mt-3 text-sm text-ink-soft">{about.mottoLabel}</figcaption>
            ) : null}
          </figure>
        ) : null}
        {about.mottoWhy ? (
          <p className="mt-6 max-w-2xl text-ink-soft lg:ml-[33%] lg:pl-6">{about.mottoWhy}</p>
        ) : null}

        {rest.map((p) => (
          <p key={p.slice(0, 48)} className="mt-10 max-w-3xl text-xl leading-relaxed text-ink lg:ml-[33%] lg:text-[1.4rem]">
            {p}
          </p>
        ))}

        <figure className="mt-20 max-w-4xl border-t border-line-strong pt-10 lg:ml-[8%]">
          <blockquote className="display-italic text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.1]">
            {about.quote}
          </blockquote>
        </figure>

        {showSkills && skills.length > 0 ? (
          <div className="mt-24 grid gap-8 lg:grid-cols-12">
            <SubHeading className="display text-3xl lg:col-span-3">
              Tools I use to <em>build</em>
            </SubHeading>
            <dl className="divide-y divide-line-strong border-y border-line-strong lg:col-span-9">
              {skills.map((group, i) => (
                <div key={group.id} className="grid gap-1 py-4 sm:grid-cols-[3rem_13rem_1fr] sm:gap-4">
                  <span aria-hidden="true" className="font-display italic text-thread">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <dt className="font-medium">{group.category}</dt>
                  <dd className="text-ink-soft">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}
