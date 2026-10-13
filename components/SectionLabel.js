/**
 * Concept: reusable component with props.
 * Matches reference .section-label: blue number + grey caps + extending line.
 */
export default function SectionLabel({ number, children }) {
  return (
    <p className="section-label mb-8">
      {number ? <span>{number}</span> : null}
      <span>{children}</span>
    </p>
  );
}