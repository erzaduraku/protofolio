import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug } from '@/lib/api';

/**
 * Concept: generateStaticParams pre-renders published project pages at build time.
 * Returns [] while every project has published: false — set published: true
 * on a project in data/db.json to bring it back (and re-run build).
 */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: 'Project not found' };
  }
  return {
    title: project.title,
    description: project.oneLiner,
  };
}

/**
 * Concept: dynamic route — Next.js 16 params is a Promise → await params.
 * Unpublished projects (published: false) → notFound().
 */
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const blocks = [
    { id: 'problem', title: 'Problem', text: project.problem },
    { id: 'built', title: 'What I built', text: project.whatIBuilt },
    { id: 'learned', title: 'What I learned', text: project.learned },
  ];

  return (
    <article className="container-page py-20 sm:py-28">
      <p className="text-sm">
        <Link href="/projects" className="link-stitch">
          ← All projects
        </Link>
      </p>
      <p className="mt-10 text-sm uppercase tracking-[0.2em] text-ink">{project.category}</p>
      <h1 className="display mt-3 text-[clamp(2.8rem,7vw,6rem)]">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-xl text-ink-soft">{project.oneLiner}</p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {blocks.map((block) => (
          <section key={block.id} className="border-t border-line-strong pt-6">
            <h2 className="display text-3xl">{block.title}</h2>
            <p className="mt-4 text-ink-soft">{block.text}</p>
          </section>
        ))}
      </div>

      <p className="mt-16 border border-line-strong px-4 py-3 text-sm text-ink-soft">
        Coming soon: screenshots · repository · demo
      </p>
    </article>
  );
}
