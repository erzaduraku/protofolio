import { SectionSkeleton } from '@/components/Skeleton';

/**
 * Concept: loading.js shows instant feedback while the route's
 * Server Component fetches data (streaming / Suspense boundary).
 */
export default function ProjectsLoading() {
  return <SectionSkeleton lines={6} />;
}
