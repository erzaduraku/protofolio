import { SectionSkeleton } from '@/components/Skeleton';

/** Concept: loading.js - instant fallback while the route streams (Suspense boundary). */
export default function ProjectsLoading() {
  return <SectionSkeleton lines={6} />;
}
