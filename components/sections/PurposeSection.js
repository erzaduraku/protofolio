import { getPurpose } from '@/lib/api';
import { emphasize } from '@/lib/emphasize';

export default async function PurposeSection({ headingLevel = 'h2' }) {
  const purpose = await getPurpose();
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  const last = purpose.paragraphs.length - 1;

  return (
    <section id="purpose" aria-labelledby="purpose-heading" className="on-ink relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="container-page relative grid gap-12 lg:grid-cols-12">
        <span aria-hidden="true" className="numeral absolute -top-8 left-4">05</span>
        <div className="relative lg:col-span-5 lg:pt-40">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-paper/70">{purpose.label}</p>
          <Heading id="purpose-heading" className="display mt-5 text-[clamp(2.3rem,4.6vw,4rem)]">
            {emphasize(purpose.heading, ['beyond code'])}
          </Heading>
        </div>
        <div className="relative space-y-6 text-lg text-paper/80 lg:col-span-6 lg:col-start-7">
          {purpose.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 56)}
              className={
                i === 0
                  ? 'drop-cap'
                  : i === last
                    ? 'border-l-2 border-thread pl-6 font-display text-[1.6rem] italic leading-snug text-paper'
                    : undefined
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
