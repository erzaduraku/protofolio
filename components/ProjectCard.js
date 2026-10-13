import ProjectVisual from './ProjectVisual';

/**
 * Concept: reusable presentational component (props in, markup out).
 * Editorial project card linking to the project's public GitHub repo
 * (external, new tab).
 * Detail pages /projects/[slug] stay off (published: false).
 *
 * Variants give each card a different composition:
 * - feature: large, drawing on top, text below
 * - compact: dark ink sheet, text-led with a small drawing
 * - wide:    drawing left, text right
 * - row:     small list row for the rest of the repositories
 */
function Meta({ project, onInk = false }) {
  return (
    <p className={`mono-label flex flex-wrap items-center gap-x-3 gap-y-1 ${onInk ? 'text-paper/80' : 'text-ink-soft'}`}>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-thread" />
        {project.language}
      </span>
      {project.team ? <span>· Team project</span> : null}
    </p>
  );
}

function Tags({ items, className = 'mt-6' }) {
  return (
    <ul className={`${className} flex flex-wrap gap-2`} aria-label="Technologies">
      {items.map((tech) => (
        <li key={tech} className="chip">
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** Title that links to the repo; ::after stretches the click target over the card. */
function CardTitle({ project, as: Tag, className }) {
  const id = `project-${project.slug}`;
  if (!project.repoUrl) {
    return (
      <Tag id={id} className={className}>
        {project.title}
      </Tag>
    );
  }
  return (
    <Tag id={id} className={className}>
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="after:absolute after:inset-0 after:z-4 after:content-['']"
      >
        {project.title}
        <span className="sr-only"> (GitHub repository, opens in a new tab)</span>
      </a>
    </Tag>
  );
}

function RepoHint({ project, onInk = false }) {
  if (!project.repoUrl) return null;
  return (
    <p aria-hidden="true" className={`mt-6 text-sm font-medium ${onInk ? 'text-paper' : 'text-thread'}`}>
      View on GitHub <span className="nudge inline-block">↗</span>
    </p>
  );
}

export default function ProjectCard({ project, variant = 'feature', titleLevel = 'h3', className = '' }) {
  const labelledBy = `project-${project.slug}`;

  if (variant === 'row') {
    return (
      <article aria-labelledby={labelledBy} className={`project-card relative border-t border-line-strong py-6 ${className}`}>
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
          <div>
            <Meta project={project} />
            <CardTitle project={project} as={titleLevel} className="project-title display mt-2 text-[1.9rem]" />
          </div>
          <div>
            <p className="text-ink-soft">{project.oneLiner}</p>
            <Tags items={project.technologies} className="mt-4" />
          </div>
        </div>
        <span aria-hidden="true" className="absolute right-0 top-6 text-thread">↗</span>
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
          <Meta project={project} onInk />
          <div className="mx-auto mt-6 h-36 w-48 text-paper">
            <ProjectVisual kind={project.slug} />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-paper/70">{project.category}</p>
          <CardTitle project={project} as={titleLevel} className="project-title display mt-2 text-[clamp(2rem,3.4vw,2.9rem)]" />
          <p className="mt-4 text-paper/80">{project.oneLiner}</p>
          <Tags items={project.technologies} />
          <RepoHint project={project} onInk />
        </div>
      </article>
    );
  }

  if (variant === 'wide') {
    return (
      <article aria-labelledby={labelledBy} className={`project-card relative ${className}`}>
        <div className="project-sheet sheet-shadow relative grid gap-6 bg-paper-light p-5 sm:grid-cols-[1fr_1.15fr] sm:gap-8 sm:p-7">
          <span aria-hidden="true" className="project-fold" />
          <div className="relative aspect-4/3 bg-paper-deep text-ink">
            <ProjectVisual kind={project.slug} />
          </div>
          <div className="flex flex-col justify-center">
            <Meta project={project} />
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-ink">{project.category}</p>
            <CardTitle project={project} as={titleLevel} className="project-title display mt-2 text-[clamp(2rem,3.4vw,2.9rem)]" />
            <p className="mt-4 text-ink-soft">{project.oneLiner}</p>
            <Tags items={project.technologies} />
            <RepoHint project={project} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article aria-labelledby={labelledBy} className={`project-card relative ${className}`}>
      <div className="project-sheet sheet-shadow relative bg-paper-light p-5 sm:p-7">
        <span aria-hidden="true" className="project-fold" />
        <div className="stitch-inset relative aspect-4/3 bg-paper-deep text-ink">
          <ProjectVisual kind={project.slug} />
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-[1.1fr_1fr]">
          <div>
            <Meta project={project} />
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-ink">{project.category}</p>
            <CardTitle project={project} as={titleLevel} className="project-title display mt-2 text-[clamp(2.4rem,4.6vw,3.8rem)]" />
          </div>
          <div className="text-ink-soft sm:pt-12">
            <p className="text-ink">{project.oneLiner}</p>
            {project.summary ? <p className="mt-3">{project.summary}</p> : null}
          </div>
        </div>
        <Tags items={project.technologies} />
        <RepoHint project={project} />
      </div>
    </article>
  );
}
