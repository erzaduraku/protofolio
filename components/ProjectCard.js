import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Tag from './Tag';

/**
 * Concept: reusable ProjectCard with props.
 * Uses <Link> for client-side navigation (prefetch + no full page reload)
 * instead of a plain <a> for internal routes.
 * Kept for reuse when projects are published (published: true).
 */
export default function ProjectCard({ project, index }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <article className="group flex flex-col p-6 transition-colors hover:bg-secondary/50">
      <Link href={`/projects/${project.slug}`} className="flex flex-1 flex-col">
        <div className="mb-6 flex items-start justify-between">
          <span className="mono-caps text-primary">{num}</span>
          <ArrowUpRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </div>
        <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.oneLiner}
        </p>
        {project.summary ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80">
            {project.summary}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-x-2 gap-y-1">
          {project.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </Link>
    </article>
  );
}