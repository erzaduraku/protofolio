/**
 * Concept: component extraction with children prop —
 * Card wraps any content; radius 0, 1px border, no shadow.
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`border border-border bg-transparent p-6 ${className}`}>
      {children}
    </div>
  );
}