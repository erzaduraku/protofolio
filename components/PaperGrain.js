/**
 * Subtle paper grain over the whole site.
 * The noise is an inline SVG feTurbulence filter (as a CSS data URI, see
 * .paper-grain in globals.css). Fixed, low opacity, pointer-events: none.
 */
export default function PaperGrain() {
  return <div aria-hidden="true" className="paper-grain" />;
}
