import { Scissors, CookingPot, Puzzle } from 'lucide-react';
import { getAbout, getInterests } from '@/lib/api';
import { emphasize } from '@/lib/emphasize';
import { getDict } from '@/lib/i18n';

const ICONS = { scissors: Scissors, 'cooking-pot': CookingPot, puzzle: Puzzle };

const LAYOUT = [
  'lg:col-span-6 lg:row-span-2 lg:min-h-96 -rotate-1 bg-paper-deep',
  'lg:col-span-4 lg:col-start-8 rotate-2 bg-chalk lg:mt-6',
  'lg:col-span-5 lg:col-start-7 rotate-[-1.5deg] bg-paper-deep',
];

export default async function BeyondSection({ locale = 'en', headingLevel = 'h2' }) {
  const [about, interests] = await Promise.all([getAbout(locale), getInterests(locale)]);
  const t = getDict(locale).beyond;
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  const Item = headingLevel === 'h1' ? 'h2' : 'h3';

  return (
    <section id="beyond" aria-labelledby="beyond-heading" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="container-page relative">
        <p aria-hidden="true" className="side-label absolute -left-1 top-24 hidden lg:block">
          {t.side}
        </p>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-2">
            <span aria-hidden="true" className="numeral block">04</span>
            <Heading id="beyond-heading" className="display -mt-10 text-[clamp(2.4rem,5vw,4.4rem)] sm:-mt-16">
              {emphasize(t.heading, [t.headingEm])}
            </Heading>
          </div>
          <p className="max-w-md text-lg text-ink-soft lg:col-span-4 lg:col-start-8 lg:self-end">
            {about.beyondLead}
          </p>
        </div>

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
          {interests.map((interest, i) => {
            const Icon = ICONS[interest.icon] || Puzzle;
            const big = i === 0;
            return (
              <li
                key={interest.id}
                className={`swatch-card relative p-7 sm:p-8 ${LAYOUT[i % LAYOUT.length]} ${
                  big ? 'sm:col-span-2 lg:col-span-6' : ''
                }`}
              >
                <Icon className={`h-7 w-7 ${big ? 'text-thread' : 'text-ink'}`} aria-hidden="true" strokeWidth={1.4} />
                <Item className={`display mt-8 ${big ? 'text-[clamp(2.2rem,4vw,3.4rem)]' : 'text-[1.9rem]'}`}>
                  {interest.title}
                </Item>
                <p className={`mt-3 text-ink-soft ${big ? 'max-w-sm text-lg' : ''}`}>{interest.text}</p>
                {interest.id === 'sudoku' ? (
                  <svg aria-hidden="true" viewBox="0 0 60 60" className="absolute right-6 top-6 h-14 w-14" fill="none" stroke="var(--line-strong)">
                    <path d="M0 20H60M0 40H60M20 0V60M40 0V60" />
                    <rect x="0.5" y="0.5" width="59" height="59" />
                    <text x="30" y="36" textAnchor="middle" fontSize="14" fontFamily="var(--font-display)" fill="var(--thread)" stroke="none">7</text>
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
