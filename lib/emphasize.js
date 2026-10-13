/**
 * Wrap the given phrases of a (data-driven) heading in <em> so Fraunces italics
 * can carry the emphasis without changing the copy stored in db.json.
 *
 * emphasize('Something I care about beyond code.', ['beyond code'])
 *   -> ['Something I care about ', <em>beyond code</em>, '.']
 */
export function emphasize(text, phrases = []) {
  if (!text || phrases.length === 0) return text;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
  // split() with a capture group keeps the matches; positions are static,
  // so the position-based key is stable for this text.
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part, i) =>
      phrases.includes(part) ? <em key={`em-${i}-${part}`}>{part}</em> : part
    );
}
