/** Small decorative primitives (all aria-hidden, pure SVG/CSS). */
export function Arrow() {
  return (
    <svg className="arrow" width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false">
      <path d="M0 5H20M16 1l4 4-4 4" />
    </svg>
  );
}

/** Konark-style wheel: 16 spokes, used as a large faint backdrop. */
export function Wheel({ className = "" }: { className?: string }) {
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    return <path key={i} d={`M${(100 + 22 * Math.sin(a)).toFixed(1)} ${(100 - 22 * Math.cos(a)).toFixed(1)} L${(100 + 86 * Math.sin(a)).toFixed(1)} ${(100 - 86 * Math.cos(a)).toFixed(1)}`} />;
  });
  const beads = Array.from({ length: 32 }, (_, i) => {
    const a = (i * 11.25 * Math.PI) / 180;
    return <circle key={i} cx={(100 + 93 * Math.sin(a)).toFixed(1)} cy={(100 - 93 * Math.cos(a)).toFixed(1)} r="1.8" fill="currentColor" stroke="none" />;
  });
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="98" />
      <circle cx="100" cy="100" r="88" />
      <circle cx="100" cy="100" r="22" />
      <circle cx="100" cy="100" r="9" />
      {spokes}
      {beads}
    </svg>
  );
}
