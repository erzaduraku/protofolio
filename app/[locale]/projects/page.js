import { getDict } from '@/lib/i18n';
import ProjectsSection from '@/components/sections/ProjectsSection';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getDict(locale).meta.projects;
}

/** Concept: static route /projects (with loading.js). Detail pages stay off while published: false. */
export default async function ProjectsPage({ params }) {
  const { locale } = await params;
  return <ProjectsSection locale={locale} headingLevel="h1" />;
}
