import Link from 'next/link';

/**
 * Concept: custom 404 page used by notFound() from dynamic routes.
 */
export default function NotFound() {
  return (
    <section className="container-page relative overflow-x-clip py-24 sm:py-32">
      <span aria-hidden="true" className="numeral block">404</span>
      <h1 className="display -mt-8 text-[clamp(2.4rem,5vw,4.4rem)]">
        Page <em>not found</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">
        That page doesn&apos;t exist — or the project isn&apos;t published yet.
      </p>
      <Link href="/" className="btn-ink mt-10">
        Back home <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
