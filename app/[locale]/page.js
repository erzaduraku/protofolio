import Link from 'next/link';
import { Suspense } from 'react';
import { getProfile } from '@/lib/api';
import { getDict } from '@/lib/i18n';
import HeroPieces from '@/components/HeroPieces';
import { SectionSkeleton } from '@/components/Skeleton';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import JourneySection from '@/components/sections/JourneySection';
import BeyondSection from '@/components/sections/BeyondSection';
import PurposeSection from '@/components/sections/PurposeSection';
import ContactSection from '@/components/sections/ContactSection';
import ScrollSpy from '@/components/ScrollSpy';

/*
 * Hero headline options (written from Erza's story: tailor mother, mechanic
 * father, software engineering student in Prishtina, logic × craft, building
 * for people too often forgotten). Option 1 is live below.
 *
 * 1. "A tailor's eye, a mechanic's patience — in code."
 * 2. "Between engines and fabric, I found software."
 * 3. "Software, cut to fit the people too often forgotten."
 */

/** Concept: the hero renders immediately; each section streams in through its own <Suspense>. */
export default async function HomePage({ params }) {
  const { locale } = await params;
  const profile = await getProfile(locale);
  const t = getDict(locale).hero;

  return (
    <>
      <ScrollSpy />
      <section data-no-reveal id="top" aria-labelledby="hero-heading" className="relative overflow-x-clip">
        <div className="container-page relative pb-24 pt-12 sm:pt-16 lg:pb-32 lg:pt-20">
          <p aria-hidden="true" className="side-label absolute left-0 top-20 hidden xl:block">
            {profile.basedIn} — {profile.role}
          </p>

          <p className="fade-up mono-label text-thread" style={{ '--i': 0 }}>
            {profile.eyebrow}
          </p>

          <h1 id="hero-heading" className="display relative z-10 mt-6 text-[clamp(2.6rem,6.8vw,6.75rem)]">
            <span className="line-mask">
              <span style={{ '--i': 0 }}>
                {t.line1[0]}
                <em>{t.line1[1]}</em>
                {t.line1[2]}
              </span>
            </span>
            <span className="line-mask">
              <span style={{ '--i': 1 }}>
                {t.line2[0]}
                <em>{t.line2[1]}</em>
                {t.line2[2]}
              </span>
            </span>
            <span className="line-mask">
              <span style={{ '--i': 2 }} className="sm:pl-[8%]">
                {t.line3}
              </span>
            </span>
          </h1>

          <div className="mt-12 grid gap-16 lg:mt-0 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="relative z-10 lg:col-span-5 lg:pt-20">
              <p className="fade-up max-w-md text-lg text-ink-soft" style={{ '--i': 4 }}>
                {profile.tagline}
              </p>
              <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ '--i': 5 }}>
                <Link href="#projects" className="btn-ink">
                  {t.viewWork} <span aria-hidden="true">↓</span>
                </Link>
                <Link href="#about" className="btn-line">
                  {t.aboutMe}
                </Link>
              </div>
            </div>
            <div className="relative lg:col-span-6 lg:col-start-7 lg:mt-[-6.4vw]">
              <HeroPieces
                label={t.piecesLabel}
                caption={profile.heroCaption}
              />
            </div>
          </div>

          <ul className="fade-up mt-20 flex flex-wrap gap-x-6 gap-y-2 border-y border-line-strong py-4 text-sm text-ink-soft" style={{ '--i': 6 }}>
            {profile.facts.map((fact, i) => (
              <li key={fact} className="flex items-center gap-6">
                {i > 0 ? <span aria-hidden="true" className="text-thread">×</span> : null}
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection locale={locale} showSkills />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ProjectsSection locale={locale} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton lines={8} />}>
        <JourneySection locale={locale} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BeyondSection locale={locale} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <PurposeSection locale={locale} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection locale={locale} />
      </Suspense>
    </>
  );
}
