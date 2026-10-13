import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug } from '@/lib/api';
import SectionLabel from '@/components/SectionLabel';
import Tag from '@/components/Tag';

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

  return (
    <article className="container-page space-y-12 py-16 sm:py-24">
      <div>
        <SectionLabel number="02">Selected projects</SectionLabel>
        <p className="mb-4 text-sm text-muted-foreground">
          <Link href="/projects" className="hover:text-primary">
            ← All projects
          </Link>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {project.oneLiner}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
          {project.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold">Problem</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {project.problem}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">What I built</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {project.whatIBuilt}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">What I learned</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {project.learned}
        </p>
      </section>

      <p className="border border-dashed border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        Coming soon: screenshots · repository · demo
      </p>
    </article>
  );
}