/**
 * Concept: small presentational component with props.
 * Mono uppercase tags in primary blue (blueprint style).
 */
export default function Tag({ children }) {
  return (
    <span className="mono-caps text-primary">
      {children}
    </span>
  );
}