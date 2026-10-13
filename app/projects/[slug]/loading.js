import Skeleton from '@/components/Skeleton';

export default function ProjectDetailLoading() {
  return (
    <div className="container-page space-y-6 py-16">
      <Skeleton lines={2} />
      <Skeleton lines={4} />
    </div>
  );
}