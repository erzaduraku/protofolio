/**
 * Concept: Suspense fallback UI while streamed server data loads.
 */
export default function Skeleton({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3" aria-hidden="true">
      <div className="h-4 w-1/3 bg-muted" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={`skel-${i}`}
          className="h-3 bg-muted"
          style={{ width: `${80 - i * 10}%` }}
        />
      ))}
    </div>
  );
}