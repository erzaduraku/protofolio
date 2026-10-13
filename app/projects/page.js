import SectionLabel from '@/components/SectionLabel';
import Link from 'next/link';

export const metadata = {
  title: 'Projects',
  description: 'Selected projects — being polished and deployed.',
};

/**
 * Concept: static route /projects.
 * Coming soon while published: false. ProjectFilter/ProjectCard kept for later.
 */
export default function ProjectsPage() {
  return (
    <div className="container-page space-y-12 py-16 sm:py-24">
      <section>
        <SectionLabel number="02">Selected projects</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-12">
          <h1 className="section-title lg:col-span-5">
            Problems explored. Systems built. Lessons kept.
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
            Each project is a record of learning—how I understood a problem, made
            choices, and turned an idea into working software.
          </p>
        </div>
      </section>

      <div className="border border-border p-8 sm:p-12">
        <p className="mono-caps text-primary">Coming soon</p>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Projects are being polished and deployed. Check back soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-primary hover:underline">
            ← Back home
          </Link>
          <Link href="/journey" className="text-muted-foreground hover:text-foreground">
            Read my journey →
          </Link>
        </div>
      </div>
    </div>
  );
}