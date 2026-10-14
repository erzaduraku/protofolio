import Link from 'next/link';
import ProjectVisual from './ProjectVisual';
import { getDict, localePath } from '@/lib/i18n';

/** Variants: feature | compact | wide | row. */
function Meta({ project, t, onInk = false }) {
  return (
    <p className={`mono-label flex flex-wrap items-center gap-x-3 gap-y-1 ${onInk ? 'text-paper/80' : 'text-ink-soft'}`}>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-thread" />
        {project.language}
      </span>
      {project.team ? <span>· {t.teamProject}</span> : null}
    </p>
  );
}

function Tags({ items, label, className = 'mt-6' }) {
  return (
    <ul className={`${className} flex flex-wrap gap-2`} aria-label={label}>
      {items.map((tech) => (
        <li key={tech} className="chip">
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** Title links to the detail page; ::after stretches the click target over the card. */
function CardTitle({ project, locale, as: Tag, className }) {
  const id = `project-${project.slug}`;
  if (!project.published) {
    return (
      <Tag id={id} className={className}>
        {project.title}
      </Tag>
    );
  }
  return (
    <Tag id={id} className={className}>
      <Link
        href={localePath(locale, `/projects/${project.slug}`)}
        className="after:absolute after:inset-0 after:z-4 after:content-['']"
      >
        {project.title}
      </Link>
    </Tag>
  );
}

/** "View project" cue plus a separate GitHub link layered above the stretched card link (no nested anchors). */
function RepoHint({ project, t, onInk = false }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
      {project.published ? (
        <span aria-hidden="true" className={onInk ? 'text-paper' : 'text-thread'}>
          {t.viewProject} <span className="nudge inline-block">→</span>
        </span>
      ) : null}
      {project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative z-5 underline underline-offset-4 ${onInk ? 'text-paper/80 decoration-paper/40 hover:text-paper' : 'text-ink-soft decoration-line-strong hover:text-ink'}`}
        >
          GitHub ↗<span className="sr-only">{t.repoFor(project.title)}</span>
        </a>
      ) : null}
    </div>
  );
}

export default function ProjectCard({ project, locale = 'en', variant = 'feature', titleLevel = 'h3', className = '' }) {
  const labelledBy = `project-${project.slug}`;
  const t = getDict(locale).projects;

  if (variant === 'row') {
    return (
      <article aria-labelledby={labelledBy} className={`project-card relative border-t border-line-strong py-6 ${className}`}>
        <div className="grid gap-3 pr-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8">
          <div>
            <Meta project={project} t={t} />
            <CardTitle project={project} locale={locale} as={titleLevel} className="project-title display mt-2 text-[1.9rem]" />
          </div>
          <div>
            <p className="text-ink-soft">{project.oneLiner}</p>
            <Tags items={project.technologies} label={t.technologies} className="mt-4" />
            <RepoHint project={project} t={t} />
          </div>
        </div>
        <span aria-hidden="true" className="absolute right-0 top-6 text-thread">→</span>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article aria-labelledby={labelledBy} className={`project-card relative ${className}`}>
        <div
          className="project-sheet on-ink sheet-shadow relative bg-ink p-7 text-paper sm:p-9"
          style={{ '--fold-bg': 'var(--paper-deep)', '--flap': '#2c4a37' }}
        >
          <span aria-hidden="true" className="project-fold" />
          <Meta project={project} t={t} onInk />
          <div className="mx-auto mt-6 h-36 w-48 text-paper">
            <ProjectVisual kind={project.slug} />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-paper/70">{project.category}</p>
          <CardTitle project={project} locale={locale} as={titleLevel} className="project-title display mt-2 text-[clamp(2rem,3.4vw,2.9rem)]" />
          <p className="mt-4 text-paper/80">{project.oneLiner}</p>
          <Tags items={project.technologies} label={t.technologies} />
          <RepoHint project={project} t={t} onInk />
        </div>
      </article>
    );
  }

  if (variant === 'wide') {
    return (
      <article aria-labelledby={labelledBy} className={`project-card relative ${className}`}>
        <div className="project-sheet sheet-shadow relative grid gap-6 bg-paper-light p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-center sm:gap-8 sm:p-7">
          <span aria-hidden="true" className="project-fold" />
          <div className="relative aspect-4/3 self-start overflow-hidden bg-paper-deep text-ink sm:self-center">
            <ProjectVisual kind={project.slug} />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <Meta project={project} t={t} />
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-ink">{project.category}</p>
            <CardTitle project={project} locale={locale} as={titleLevel} className="project-title display mt-2 text-[clamp(2rem,3.4vw,2.9rem)]" />
            <p className="mt-4 text-ink-soft">{project.oneLiner}</p>
            <Tags items={project.technologies} label={t.technologies} />
            <RepoHint project={project} t={t} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article aria-labelledby={labelledBy} className={`project-card relative ${className}`}>
      <div className="project-sheet sheet-shadow relative bg-paper-light p-5 sm:p-7">
        <span aria-hidden="true" className="project-fold" />
        <div className="stitch-inset relative aspect-4/3 overflow-hidden bg-paper-deep text-ink">
          <ProjectVisual kind={project.slug} />
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <Meta project={project} t={t} />
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-ink">{project.category}</p>
            <CardTitle project={project} locale={locale} as={titleLevel} className="project-title display mt-2 text-[clamp(2.4rem,4.6vw,3.8rem)]" />
          </div>
          <div className="text-ink-soft sm:pt-12">
            <p className="text-ink">{project.oneLiner}</p>
            {project.summary ? <p className="mt-3">{project.summary}</p> : null}
          </div>
        </div>
        <Tags items={project.technologies} label={t.technologies} />
        <RepoHint project={project} t={t} />
      </div>
    </article>
  );
}
