/** Decorative SVG drawings for project cards (aria-hidden). */
export default function ProjectVisual({ kind }) {
  if (kind === 'collabai-project-management') {
    // a task board: three columns of cards
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" aria-hidden="true">
        {[0, 1, 2].map((col) => (
          <g key={`col-${col}`}>
            <rect x={40 + col * 112} y="44" width="96" height="212" stroke="var(--line-strong)" />
            {[0, 1, 2, 3].slice(0, 4 - col).map((row) => (
              <rect
                key={`card-${col}-${row}`}
                x={50 + col * 112}
                y={58 + row * 48}
                width="76"
                height="36"
                fill={col === 1 && row === 0 ? 'var(--chalk)' : 'var(--paper-light)'}
                stroke="var(--ink)"
              />
            ))}
          </g>
        ))}
        <circle cx="330" cy="236" r="16" fill="var(--thread)" />
        <path d="M322 236 h16 M330 228 v16" stroke="var(--paper-light)" strokeWidth="2" />
      </svg>
    );
  }

  // a parking lot with one reserved bay and a location pin
  if (kind === 'parkeasy') {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M60 230 H340" strokeOpacity="0.5" />
        {[60, 116, 172, 228, 284, 340].map((x) => (
          <path key={x} d={`M${x} 230 V150`} strokeOpacity="0.5" />
        ))}
        <rect x="176" y="158" width="48" height="64" fill="var(--color-thread)" fillOpacity="0.12" stroke="var(--color-thread)" />
        <path d="M200 60 c-22 0 -36 16 -36 34 c0 26 36 52 36 52 s36 -26 36 -52 c0 -18 -14 -34 -36 -34 z" />
        <text x="200" y="104" textAnchor="middle" fontSize="30" fontStyle="italic" fill="currentColor" stroke="none">P</text>
      </svg>
    );
  }

  if (kind === 'erza-master-project') {
    // VPC with public/private subnets and a load balancer
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" aria-hidden="true" stroke="currentColor">
        <rect x="30" y="30" width="340" height="240" strokeWidth="1.2" opacity="0.8" />
        {[0, 1, 2].map((i) => (
          <g key={`az-${i}`}>
            <rect x={50 + i * 108} y="60" width="92" height="56" opacity="0.6" />
            <rect x={50 + i * 108} y="170" width="92" height="76" opacity="0.6" />
            <rect x={78 + i * 108} y="196" width="36" height="28" fill="var(--chalk)" stroke="none" />
          </g>
        ))}
        <path d="M200 10 V60 M96 116 V170 M204 116 V170 M312 116 V170" strokeDasharray="4 4" opacity="0.8" />
        <rect x="176" y="74" width="48" height="28" fill="var(--paper)" stroke="none" />
      </svg>
    );
  }

  // predictive-text-engine: a small trie
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.7">
        <path d="M200 50 L120 130 M200 50 L280 130 M120 130 L80 210 M120 130 L160 210 M280 130 L250 210 M280 130 L320 210" />
      </g>
      {[
        [200, 50, 't'],
        [120, 130, 'h'],
        [280, 130, 'r'],
        [80, 210, 'e'],
        [160, 210, 'i'],
        [250, 210, 'i'],
        [320, 210, 'y'],
      ].map(([cx, cy, ch]) => (
        <g key={`node-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="17" fill="var(--paper-light)" stroke="currentColor" strokeWidth="1.2" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontSize="18" fill="currentColor">
            {ch}
          </text>
        </g>
      ))}
      <circle cx="80" cy="210" r="23" stroke="var(--thread)" strokeWidth="1.6" strokeDasharray="4 4" />
    </svg>
  );
}
