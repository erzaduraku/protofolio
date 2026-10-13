import Link from 'next/link';

/**
 * Concept: custom 404 page used by notFound() from dynamic routes.
 */
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center sm:py-32">
      <p className="mono-caps text-primary">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        That page doesn&apos;t exist — or the project isn&apos;t published yet.
      </p>
      <Link href="/" className="mt-8 inline-block text-primary hover:underline">
        Back home →
      </Link>
    </div>
  );
}