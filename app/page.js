import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getProfile } from '@/lib/api';
import Skeleton from '@/components/Skeleton';
import SectionLabel from '@/components/SectionLabel';
import HomeAboutPreview from '@/components/HomeAboutPreview';
import CurrentlyCard from '@/components/CurrentlyCard';
import HomeBeyondPreview from '@/components/HomeBeyondPreview';
import HomePurposePreview from '@/components/HomePurposePreview';
import HomeContactPreview from '@/components/HomeContactPreview';

/**
 * Concept: Home is a Server Component with a long one-page overview.
 * Separate async children each fetch their own data and stream via <Suspense>.
 * Projects stay "Coming soon" (published: false) — no project cards here.
 */
export default async function HomePage() {
  const profile = await getProfile();

  return (
    <div id="top">
      {/* Hero */}
      <section className="container-page pb-10 pt-16 sm:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mono-caps mb-6 flex items-center gap-2 text-primary">
              <span aria-hidden>○</span>
              {profile.eyebrow}
            </p>
            <h1 className="text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[1.02] tracking-tight">
              <span className="block text-foreground">{profile.headlineLine1}</span>
              <span className="block text-muted-foreground">
                {profile.headlineLine2}
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
              >
                View my work ↓
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary"
              >
                About me
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-[-0.75rem_0.75rem_0.75rem_-0.75rem] -z-10 border border-border"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute right-0 top-0 h-20 w-20 border-r border-t border-primary"
                aria-hidden
              />
              <Image
                src="/engineering-craft.jpg"
                alt="Blueprint-style illustration representing logic and craft"
                width={900}
                height={700}
                priority
                className="h-auto w-full border border-border object-cover"
              />
              <div className="absolute bottom-4 left-4 border border-primary bg-background px-3 py-2">
                <p className="mono-caps text-primary">{profile.heroCaption}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-y border-border py-5">
          <p className="mono-caps flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-muted-foreground">
            {profile.facts.map((fact, i) => (
              <span key={fact} className="inline-flex items-center gap-3">
                {i > 0 ? (
                  <span className="text-primary" aria-hidden>
                    *
                  </span>
                ) : null}
                <span>{fact}</span>
              </span>
            ))}
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="container-page py-24"><Skeleton lines={6} /></div>}>
        <HomeAboutPreview />
      </Suspense>

      <section id="projects" className="container-page py-24 sm:py-32">
        <SectionLabel number="02">Selected projects</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="section-title">
              Problems explored. Systems built. Lessons kept.
            </h2>
          </div>
          <p className="max-w-xl leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
            Each project is a record of learning—how I understood a problem, made
            choices, and turned an idea into working software.
          </p>
        </div>
        <div className="mt-12 border border-border p-8 sm:p-12">
          <p className="mono-caps text-primary">Coming soon</p>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Projects are being polished and deployed. Check back soon.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/projects" className="text-primary hover:underline">
              Projects page →
            </Link>
            <Link href="/journey" className="text-muted-foreground hover:text-foreground">
              Read my journey →
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="container-page py-24"><Skeleton lines={8} /></div>}>
        <CurrentlyCard />
      </Suspense>

      <Suspense fallback={<div className="container-page py-24"><Skeleton lines={4} /></div>}>
        <HomeBeyondPreview />
      </Suspense>

      <Suspense fallback={<div className="container-page py-24"><Skeleton lines={5} /></div>}>
        <HomePurposePreview />
      </Suspense>

      <Suspense fallback={<div className="container-page py-24"><Skeleton lines={3} /></div>}>
        <HomeContactPreview />
      </Suspense>
    </div>
  );
}