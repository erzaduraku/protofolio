import { getProjects } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { getDict } from '@/lib/i18n';

/**
 * Cards link to /projects/[slug]. Which projects show, and in what order, comes from data/db.json
 * (single source, Finance §32): only `published: true`, split by `featured`, sorted by `order`.
 * The first three featured projects get the feature / compact / wide card layouts.
 */

export default async function ProjectsSection({ locale = 'en' }) {
  const projects = [...(await getProjects(locale))].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  const t = getDict(locale).projects;
  const [collab, parkeasy, infra] = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured && p.repoUrl);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-x-clip border-y border-line-strong bg-paper-deep py-24 sm:py-32"
    >
      <div className="container-page relative">
        <p aria-hidden="true" className="side-label absolute -left-1 top-1 hidden lg:block">
          {t.side}
        </p>

        <div className="grid items-end gap-6 lg:grid-cols-12">
          <span aria-hidden="true" className="numeral -mb-6 lg:col-span-4 lg:mb-0 lg:pl-6">
            02
          </span>
          <div className="lg:col-span-8 lg:text-right">
            <h2 id="projects-heading" className="display text-[clamp(2.2rem,4.8vw,4.25rem)]">
              {t.heading[0]}
              <em>{t.heading[1]}</em>
            </h2>
            <p className="mt-6 max-w-xl text-ink-soft lg:ml-auto">{t.lead}</p>
          </div>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          {collab ? (
            <ProjectCard project={collab} locale={locale} variant="feature" titleLevel="h3" className="lg:col-span-7" />
          ) : null}
          {parkeasy ? (
            <ProjectCard project={parkeasy} locale={locale} variant="compact" titleLevel="h3" className="lg:col-span-5 lg:mt-36" />
          ) : null}
          {infra ? (
            <ProjectCard project={infra} locale={locale} variant="wide" titleLevel="h3" className="lg:col-span-9 lg:col-start-3" />
          ) : null}
        </div>

        {more.length > 0 ? (
          <div className="mt-24 grid gap-8 lg:grid-cols-12">
            <h3 className="display text-[clamp(1.9rem,3vw,2.6rem)] lg:col-span-3">
              {t.more[0]}
              <em>{t.more[1]}</em>
            </h3>
            <div className="border-b border-line-strong lg:col-span-9">
              {more.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} variant="row" titleLevel="h4" />
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}
