import { getFeaturedProjects } from '@/lib/api';
import ProjectCard from './ProjectCard';
import SectionLabel from './SectionLabel';

/**
 * Concept: async Server Component that fetches its own data.
 * Currently unused on Home while projects have published: false —
 * kept for the course demo; set published: true and re-import on the Home page.
 */
export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <section>
      <SectionLabel number="02">Selected projects</SectionLabel>
      <div className="grid grid-cols-1 border border-border sm:grid-cols-2">
        {projects.map((project, i) => (
          <div key={project.slug} className="border-b border-border sm:border-r">
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}