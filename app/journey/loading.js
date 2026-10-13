import Skeleton from '@/components/Skeleton';

export default function JourneyLoading() {
  return (
    <div className="container-page space-y-8 py-16">
      <Skeleton lines={2} />
      <Skeleton lines={8} />
    </div>
  );
}