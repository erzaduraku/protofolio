import { getAllProjects } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';

/** Featured: CollabAI, ParkEasy, DCADD. Cards link to /projects/[slug]. */
const FEATURED = ['collabai-project-management', 'parkeasy', 'erza-master-project'];
const MORE = ['predictive-text-engine', 'text-rule-processor', 'maze-solver', 'firebase-auth-erza'];

export default async function ProjectsSection({ headingLevel = 'h2' }) {
  const all = await getAllProjects();
  const bySlug = Object.fromEntries(all.map((p) => [p.slug, p]));
  const pick = (slugs) => slugs.map((slug) => bySlug[slug]).filter((p) => p?.repoUrl);
  const [collab, parkeasy, infra] = FEATURED.map((slug) => bySlug[slug]);
  const more = pick(MORE);
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  const Sub = headingLevel === 'h1' ? 'h2' : 'h3';
  const titleLevel = headingLevel === 'h1' ? 'h3' : 'h4';
  const featureTitle = headingLevel === 'h1' ? 'h2' : 'h3';

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-x-clip border-y border-line-strong bg-paper-deep py-24 sm:py-32"
    >
      <div className="container-page relative">
        <p aria-hidden="true" className="side-label absolute -left-1 top-1 hidden lg:block">
          Selected projects
        </p>

        <div className="grid items-end gap-6 lg:grid-cols-12">
          <span aria-hidden="true" className="numeral -mb-6 lg:col-span-4 lg:mb-0 lg:pl-6">
            02
          </span>
          <div className="lg:col-span-8 lg:text-right">
            <Heading id="projects-heading" className="display text-[clamp(2.2rem,4.8vw,4.25rem)]">
              Problems explored. Systems built. <em>Lessons kept.</em>
            </Heading>
            <p className="mt-6 max-w-xl text-ink-soft lg:ml-auto">
              Each project is a record of learning—how I understood a problem, made
              choices, and turned an idea into working software.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          {collab ? (
            <ProjectCard project={collab} variant="feature" titleLevel={featureTitle} className="lg:col-span-7" />
          ) : null}
          {parkeasy ? (
            <ProjectCard project={parkeasy} variant="compact" titleLevel={featureTitle} className="lg:col-span-5 lg:mt-36" />
          ) : null}
          {infra ? (
            <ProjectCard project={infra} variant="wide" titleLevel={featureTitle} className="lg:col-span-9 lg:col-start-3" />
          ) : null}
        </div>

        {more.length > 0 ? (
          <div className="mt-24 grid gap-8 lg:grid-cols-12">
            <Sub className="display text-[clamp(1.9rem,3vw,2.6rem)] lg:col-span-3">
              More on <em>GitHub</em>
            </Sub>
            <div className="border-b border-line-strong lg:col-span-9">
              {more.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="row" titleLevel={titleLevel} />
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}
