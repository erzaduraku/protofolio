'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';

const FILTERS = ['All', 'Mobile', 'AI', 'Web', 'Data', 'Cloud'];

/**
 * Concept: Client Component with useState for interactive filtering.
 * Projects are fetched on the server and passed in as props.
 *
 * Why derive the filtered list during render (no extra state, no useEffect)?
 * Filtering is a pure calculation from (projects + activeFilter).
 * Keeping a second "filteredProjects" state would duplicate data and risk
 * getting out of sync — React docs recommend deriving during render instead.
 *
 * Kept for reuse when projects are published.
 */
export default function ProjectFilter({ projects }) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={
              active === filter
                ? 'border border-primary bg-primary px-3 py-1.5 text-xs text-primary-foreground'
                : 'border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground'
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 border border-border sm:grid-cols-2">
        {filtered.map((project, i) => (
          <div
            key={project.slug}
            className="border-b border-r border-border last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}