import { SectionSkeleton } from '@/components/Skeleton';

/** Concept: loading.js for /journey (route-level Suspense boundary). */
export default function JourneyLoading() {
  return <SectionSkeleton lines={8} />;
}
