import Skeleton from '@/components/Skeleton';

/**
 * Concept: loading.js shows instant feedback while the route's
 * Server Component fetches data (streaming / Suspense boundary).
 */
export default function ProjectsLoading() {
  return (
    <div className="container-page space-y-8 py-16">
      <Skeleton lines={2} />
      <Skeleton lines={6} />
    </div>
  );
}