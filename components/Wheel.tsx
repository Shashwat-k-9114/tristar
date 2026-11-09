// Decorative Konark-style wheel used twice in the hero.
const range = (n: number, step: number) => Array.from({ length: n }, (_, i) => i * step);

export function Wheel({ className }: { className: string }) {
  return (
    <svg className={`hero-wheel ${className}`} viewBox="-150 -150 300 300" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle r="92" />
        <circle r="20" />
        <circle r="8" fill="currentColor" />
        {range(16, 22.5).map((a) => (
          <line key={a} x1="0" y1="-20" x2="0" y2="-92" transform={`rotate(${a})`} />
        ))}
      </g>
      <g fill="currentColor" opacity=".75">
        {range(16, 22.5).map((a) => (
          <path key={a} d="M0,-96 C10,-108 10,-120 0,-130 C-10,-120 -10,-108 0,-96Z" transform={`rotate(${a})`} />
        ))}
        {range(32, 11.25).map((a) => (
          <circle key={a} cx="0" cy="-140" r="2.6" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}
