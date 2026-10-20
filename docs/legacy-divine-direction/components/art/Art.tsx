/**
 * Placeholder art direction — original fine-line drawings in antique gold, NOT photography and
 * NOT AI imagery. Each sits inside a frame of its sub-brand's shape and is replaced by licensed
 * photography listed in docs/05-media-inventory-and-shot-list.md.
 */
type P = { className?: string };
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

export function HandiArt({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 300 410" aria-hidden="true" focusable="false">
      <g {...line}>
        <circle cx="150" cy="206" r="5" />
        <path d="M80 270 C80 232 112 212 150 212 C188 212 220 232 220 270 Z" />
        <path d="M70 270 H230" />
        <path d="M86 270 C86 336 114 358 150 358 C186 358 214 336 214 270" />
        <path d="M86 288 C66 288 62 310 82 314" />
        <path d="M214 288 C234 288 238 310 218 314" />
        <path d="M100 380 H200" />
        <g opacity=".55">
          <path d="M132 198 C120 172 144 158 130 132 C120 112 136 98 128 74" />
          <path d="M152 194 C142 166 164 150 152 122 C144 102 158 86 150 58" />
          <path d="M172 198 C160 174 182 160 170 136 C162 118 176 104 168 82" />
        </g>
      </g>
    </svg>
  );
}

export function SamosaArt({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 300 410" aria-hidden="true" focusable="false">
      <g {...line}>
        <path d="M150 128 L248 300 H52 Z" />
        <path d="M150 168 L216 284 H84 Z" opacity=".5" />
        <path d="M60 340 H240" opacity=".7" />
      </g>
    </svg>
  );
}

export function ThaliArt({ className }: P) {
  const bowls = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return [150 + 76 * Math.cos(a), 150 + 76 * Math.sin(a)] as const;
  });
  return (
    <svg className={className} viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <g {...line}>
        <circle cx="150" cy="150" r="128" opacity=".7" />
        <circle cx="150" cy="150" r="116" />
        <circle cx="150" cy="150" r="34" />
        <circle cx="150" cy="150" r="24" opacity=".5" />
        {bowls.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="26" />
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="18" opacity=".45" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false">
      <path d="M0 5H20M16 1l4 4-4 4" />
    </svg>
  );
}
