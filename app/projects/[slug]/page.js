import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, getProjectBySlug } from '@/lib/api';

/**
 * Concept: dynamic route with generateStaticParams. Only published projects are
 * pre-rendered; dynamicParams = false makes any other slug a real 404.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };
  return { title: project.title, description: project.oneLiner };
}

function Section({ id, title, children, className = '' }) {
  return (
    <section aria-labelledby={id} className={`border-t border-line-strong pt-8 ${className}`}>
      <h2 id={id} className="display text-[clamp(1.9rem,3vw,2.6rem)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Gallery({ shots }) {
  const portrait = shots.every((shot) => shot.height > shot.width);
  const wideFirst = !portrait && shots.length > 2;
  return (
    <ul className={`mt-6 grid gap-8 ${portrait ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
      {shots.map((shot, i) => (
        <li key={shot.src} className={i === 0 && wideFirst ? 'md:col-span-2' : ''}>
          <figure className="sheet-shadow bg-paper-light p-3">
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes={portrait ? '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw' : i === 0 && wideFirst ? '(min-width: 768px) 80vw, 100vw' : '(min-width: 768px) 40vw, 100vw'}
              className="h-auto w-full"
              unoptimized
            />
            <figcaption className="mt-3 px-1 font-display text-base italic text-ink-soft">{shot.alt}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // screenshotGroups (titled groups) wins; plain screenshots render as one untitled group.
  const groups = project.screenshotGroups?.length
    ? project.screenshotGroups
    : project.screenshots?.length
      ? [{ title: null, items: project.screenshots }]
      : [];
  const team = project.teamInfo || null;

  return (
    <article className="container-page pt-14 pb-24 sm:pt-20 sm:pb-32">
      <p className="text-sm">
        <Link href="/projects" className="link-stitch">
          ← All projects
        </Link>
      </p>

      <header className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-thread" />
              {project.language}
            </span>
            {project.category ? <span>· {project.category}</span> : null}
            {project.team ? <span>· Team project</span> : null}
          </p>
          <h1 className="display mt-5 text-[clamp(2.8rem,7vw,6rem)]">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft">{project.oneLiner}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end lg:justify-end">
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ink">
              View on GitHub <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
              Live demo <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </header>

      {project.overview ? (
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <Section id="overview" title="Overview" className="lg:col-span-7">
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{project.overview}</p>
          </Section>
          {project.techStack?.length ? (
            <Section id="stack" title="Tech stack" className="lg:col-span-4 lg:col-start-9 lg:mt-16">
              <dl className="mt-5 space-y-4">
                {project.techStack.map((group) => (
                  <div key={group.group}>
                    <dt className="text-sm text-ink-soft">{group.group}</dt>
                    <dd className="mt-1">{group.items.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          ) : null}
        </div>
      ) : null}

      {project.demoVideo?.src ? (
        <Section id="demo" title="Demo" className="mt-20">
          <figure className="sheet-shadow mt-8 bg-paper-light p-3 sm:p-4">
            <video
              controls
              playsInline
              muted
              preload="metadata"
              poster={project.demoVideo.poster}
              width={project.demoVideo.width}
              height={project.demoVideo.height}
              className="block h-auto w-full rounded-sm bg-ink"
            >
              <source src={project.demoVideo.src} type="video/mp4" />
              Your browser can’t play this video.{' '}
              <a href={project.demoVideo.src} className="link-stitch">
                Download the demo
              </a>
              .
            </video>
            {project.demoVideo.caption ? (
              <figcaption className="mt-3 px-1 font-display text-base italic text-ink-soft">
                {project.demoVideo.caption}
              </figcaption>
            ) : null}
          </figure>
        </Section>
      ) : null}

      {project.features?.length ? (
        <Section id="features" title="Features" className="mt-20 lg:ml-[16%]">
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="border-l-2 border-thread pl-4 text-ink-soft">
                {feature}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {project.howItWorks?.length ? (
        <Section id="how" title="How it works" className="mt-20 lg:mr-[16%]">
          <ol className="mt-6 divide-y divide-line-strong border-y border-line-strong">
            {project.howItWorks.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 py-4 text-ink-soft">
                <span aria-hidden="true" className="font-display italic text-thread">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {groups.length ? (
        <Section id="screenshots" title="Screenshots" className="mt-20">
          {groups.map((group) => (
            <div key={group.title || 'all'} className={group.title ? 'mt-12 first:mt-8' : 'mt-8'}>
              {group.title ? (
                <h3 className="flex items-baseline gap-3 font-display text-2xl italic">
                  {group.title}
                  <span className="font-sans text-sm not-italic text-ink-soft">{group.items.length}</span>
                </h3>
              ) : null}
              <Gallery shots={group.items} />
            </div>
          ))}
        </Section>
      ) : null}

      {team ? (
        <Section id="team" title={team.members?.length ? 'Team' : 'Role'} className="mt-20 max-w-2xl">
          <p className="mt-5 text-ink-soft">{team.note}</p>
          {team.members?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Team members">
              {team.members.map((member) => (
                <li key={member} className="chip">
                  {member}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      <p className="mt-20 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <Link href="/projects" className="link-stitch">
          ← Back to all projects
        </Link>
        {project.repoUrl ? (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="link-stitch">
            Source on GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </p>
    </article>
  );
}
