'use client';

/**
 * Concept: global-error.js (course lecture 44). Catches errors thrown by the root layout
 * itself (app/[locale]/layout.js), where error.js can't help. It replaces the whole
 * document, so it needs its own <html> and <body>. Kept plain: fonts and CSS may be broken here.
 */
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>Please try again.</p>
        {/* reset() re-renders the root layout once more */}
        <button type="button" onClick={() => reset()} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
