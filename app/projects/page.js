import ProjectsSection from '@/components/sections/ProjectsSection';

export const metadata = {
  title: 'Projects',
  description: 'Selected projects by Erza Duraku, with links to GitHub.',
};

/** Concept: static route /projects (with loading.js). Detail pages stay off while published: false. */
export default function ProjectsPage() {
  return <ProjectsSection headingLevel="h1" />;
}
