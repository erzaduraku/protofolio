/**
 * Tiny, safe markdown for chat replies: **bold**, [label](url), bare URLs,
 * "- " / "1. " lists and line breaks. Builds React elements only (no HTML injection);
 * links are limited to http(s) and site-relative paths.
 */
const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;

function safeHref(url) {
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/(?!\/)/.test(url)) return url;
  return null;
}

function shortLabel(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, '');
    const label = u.hostname.replace(/^www\./, '') + path;
    return label.length > 38 ? `${label.slice(0, 36)}…` : label;
  } catch {
    return url;
  }
}

function LinkOut({ href, children }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="underline decoration-paper/40 underline-offset-2 hover:decoration-chalk hover:text-chalk"
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

function inline(text, keyBase) {
  const out = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${k++}`;
    if (m[1]) {
      out.push(<strong key={key} className="font-semibold">{m[1]}</strong>);
    } else if (m[2]) {
      const href = safeHref(m[3]);
      out.push(href ? <LinkOut key={key} href={href}>{m[2]}</LinkOut> : m[2]);
    } else if (m[4]) {
      out.push(<LinkOut key={key} href={m[4]}>{shortLabel(m[4])}</LinkOut>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ChatMarkdown({ text }) {
  const blocks = [];
  let para = [];
  let list = null;
  const flushPara = () => {
    if (para.length) blocks.push({ type: 'p', lines: para });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*(?:[-*•])\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return blocks.map((b, i) => {
    if (b.type === 'p') {
      return (
        <p key={i} className="[&:not(:first-child)]:mt-2">
          {b.lines.map((l, j) => (
            <span key={j}>
              {j > 0 ? <br /> : null}
              {inline(l, `${i}-${j}`)}
            </span>
          ))}
        </p>
      );
    }
    const List = b.type;
    return (
      <List key={i} className={`mt-2 space-y-1 pl-5 ${b.type === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-thread`}>
        {b.items.map((item, j) => (
          <li key={j}>{inline(item, `${i}-${j}`)}</li>
        ))}
      </List>
    );
  });
}
