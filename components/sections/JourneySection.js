import Image from 'next/image';
import { getJourney } from '@/lib/api';
import { emphasize } from '@/lib/emphasize';
import PolaroidStack from '@/components/PolaroidStack';
import Parallax from '@/components/Parallax';
import { getDict } from '@/lib/i18n';

/** Each event shows one concise summary (about two sentences) plus the role list. */
export default async function JourneySection({ locale = 'en', headingLevel = 'h2' }) {
  const { experience, volunteering, volunteeringQuote, learning } = await getJourney(locale);
  const t = getDict(locale).journey;
  const newTab = getDict(locale).common.newTab;
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  const Sub = headingLevel === 'h1' ? 'h2' : 'h3';
  const Item = headingLevel === 'h1' ? 'h3' : 'h4';
  // The internship already has its own card; keep the rest of the timeline.
  const timeline = learning.filter((item) => item.place !== experience.company);

  return (
    <section id="journey" aria-labelledby="journey-heading" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="container-page relative">
        <div className="relative grid gap-8 lg:grid-cols-12">
          <span aria-hidden="true" className="numeral absolute -top-6 right-0 sm:-top-14">
            03
          </span>
          <div className="relative lg:col-span-7">
            <p className="kicker">{t.kicker}</p>
            <Heading id="journey-heading" className="display mt-5 text-[clamp(2.4rem,5.4vw,4.75rem)]">
              {t.heading[0]}
              <em>{t.heading[1]}</em>
              {t.heading[2]}
            </Heading>
          </div>
          <p className="max-w-md text-lg text-ink-soft lg:col-span-4 lg:col-start-8 lg:mt-36">
            {t.lead}
          </p>
        </div>

        <article
          aria-labelledby="exp-heading"
          data-reveal
          className="sheet-shadow mt-16 grid lg:mt-24 lg:grid-cols-12"
        >
          <div className="on-ink bg-ink p-8 text-paper sm:p-10 lg:col-span-5">
            <p className="mono-label text-paper/75">{experience.period}</p>
            <Sub id="exp-heading" className="display mt-6 text-[clamp(2.2rem,3.8vw,3.4rem)]">
              {experience.role}
            </Sub>
            <p className="mt-3 font-display text-3xl italic text-thread">{experience.company}</p>
            <p className="mt-10 text-paper/80">{experience.summary}</p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.tools}>
              {experience.chips.map((chip) => (
                <li key={chip} className="chip">
                  {chip}
                </li>
              ))}
            </ul>
            {experience.images?.[0] ? (
              <figure data-robot-photo className="relative mt-10 max-w-md lg:max-w-none">
                {/* data-robot-photo: a real photo of Erza, so the chat robot may joke about it */}
                <span aria-hidden="true" className="polaroid-tape" />
                <div className="relative aspect-6/5 overflow-hidden border border-paper/20">
                  <Image
                    src={experience.images[0]}
                    alt={experience.imageAlts?.[0] || experience.company}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 28rem, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                {experience.imageCaptions?.[0] ? (
                  <figcaption className="mt-3 font-display text-base italic text-paper/75">
                    {experience.imageCaptions[0]}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>
          <div className="bg-paper-light p-8 sm:p-10 lg:col-span-7">
            <p className="display-italic text-[1.55rem] leading-snug">{experience.comparison}</p>
            <ol className="mt-8 divide-y divide-line-strong border-y border-line-strong">
              {experience.learningPoints.map((point, i) => (
                <li key={point.slice(0, 40)} className="grid grid-cols-[2.5rem_1fr] gap-2 py-3 text-ink-soft">
                  <span aria-hidden="true" className="font-display italic text-thread">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {point}
                </li>
              ))}
            </ol>
            {experience.course ? (
              <div className="mt-8 border-l-2 border-thread pl-4">
                <p className="text-sm text-ink-soft">{experience.course.label}</p>
                <p className="mt-1 font-display text-xl leading-snug">
                  {experience.course.url ? (
                    <a
                      href={experience.course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-line-strong underline-offset-4 hover:decoration-thread"
                    >
                      {experience.course.title}
                      <span className="sr-only">{newTab}</span>
                    </a>
                  ) : (
                    experience.course.title
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {[experience.course.platform, experience.course.instructor, experience.course.status]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            ) : null}
          </div>
        </article>

        {timeline.length > 0 ? (
          <ol className="mt-20 grid gap-12 border-t-2 border-ink pt-10 sm:grid-cols-2 lg:ml-[16%]">
            {timeline.map((item) => (
              <li key={item.id} className="relative">
                <span aria-hidden="true" className="absolute top-[-2.9rem] left-0 h-5 w-0.5 bg-thread" />
                <p className="mono-label text-thread">{item.year}</p>
                <Item className="display mt-3 text-[1.9rem]">{item.title}</Item>
                {item.place ? <p className="mt-1 text-sm font-medium text-ink">{item.place}</p> : null}
                <p className="mt-3 max-w-md text-ink-soft">{item.detail}</p>
                {item.chips?.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.topics}>
                    {item.chips.map((chip) => (
                      <li key={chip} className="chip">
                        {chip}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.certificate ? (
                  <a href={item.certificate} target="_blank" rel="noopener noreferrer" className="link-stitch mt-4 inline-block font-medium">
                    {getDict(locale).common.viewCertificate} <span aria-hidden="true">↗</span>
                    <span className="sr-only">{newTab}</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-28 grid gap-6 lg:grid-cols-12">
          <p className="kicker lg:col-span-12">{t.outside}</p>
          <Sub className="display text-[clamp(2.2rem,4.6vw,4rem)] lg:col-span-9">
            {emphasize(t.community, [t.communityEm])}
          </Sub>
        </div>

        <div className="mt-16 space-y-24 sm:space-y-28">
          {volunteering.map((event, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={event.id}
                data-reveal
                aria-labelledby={`event-${event.id}`}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10"
              >
                <div className={`lg:col-span-6 ${flip ? 'lg:order-2 lg:col-start-7' : ''}`}>
                  {event.images?.length ? (
                    <Parallax strength={12}>
                      <PolaroidStack
                        images={event.images}
                        alts={event.imageAlts}
                        captions={event.imageCaptions}
                        title={event.title}
                        locale={locale}
                      />
                    </Parallax>
                  ) : null}
                </div>
                <div
                  className={`lg:col-span-5 ${
                    flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'
                  } ${i === 1 ? 'lg:pt-16' : ''}`}
                >
                  <p className="mono-label text-thread">
                    {event.date} · {event.place}
                  </p>
                  <Item id={`event-${event.id}`} className="display mt-4 text-[clamp(2rem,3.4vw,2.9rem)]">
                    {event.title}
                  </Item>
                  <div className="mt-5 space-y-4 text-ink-soft">
                    <p>{event.short}</p>
                  </div>
                  {event.role?.length ? (
                    <div className="mt-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">{t.role}</p>
                      <ul className="mt-2 space-y-1.5">
                        {event.role.map((r) => (
                          <li key={r} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 border-t border-ink" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <figure data-reveal className="mt-28 max-w-3xl lg:ml-auto lg:mr-[6%]">
          <blockquote className="display-italic text-[clamp(1.9rem,3.8vw,3.2rem)] leading-[1.08]">
            <span aria-hidden="true" className="text-thread">“</span>
            {volunteeringQuote.quote}
            <span aria-hidden="true" className="text-thread">”</span>
          </blockquote>
          <figcaption className="mt-6 max-w-xl border-l-2 border-thread pl-5 text-ink-soft">
            {volunteeringQuote.reflection}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
