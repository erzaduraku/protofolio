/**
 * Concept: Suspense / loading.js fallback while streamed server data loads.
 * Pulses with opacity only.
 */
export default function Skeleton({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3" aria-hidden="true">
      <div className="h-8 w-1/2 bg-line" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={`skel-${i}`}
          className="h-3 bg-line"
          style={{ width: `${82 - i * 9}%` }}
        />
      ))}
    </div>
  );
}

export function SectionSkeleton({ lines = 5 }) {
  return (
    <div className="container-page py-24" role="status">
      <span className="sr-only">Loading…</span>
      <Skeleton lines={lines} />
    </div>
  );
}
