/** Original SVG ornaments inspired by Odia temple, textile and scroll-painting motifs. */

type P = { className?: string };

/** Wheel inspired by the Konark chariot-wheel motif: beaded rim, eight spokes, medallion hub. */
export function WheelMotif({ className }: P) {
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45);
  const beads = Array.from({ length: 32 }, (_, i) => i * (360 / 32));
  return (
    <svg className={className} viewBox="-100 -100 200 200" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <circle r="96" strokeWidth="2" />
      <circle r="80" strokeWidth="1" />
      {beads.map((a) => (
        <circle key={a} r="1.8" cx="0" cy="-88" fill="currentColor" stroke="none" transform={`rotate(${a})`} />
      ))}
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M-5 -22 L0 -80 L5 -22 Z" strokeWidth="1.2" />
          <circle cy="-50" r="4" strokeWidth="1" />
        </g>
      ))}
      <circle r="22" strokeWidth="1.5" />
      <circle r="13" strokeWidth="1" />
      <circle r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Lotus({ className }: P) {
  const petals = [-70, -42, -14, 14, 42, 70];
  return (
    <svg className={className} viewBox="-60 -60 120 80" fill="currentColor" aria-hidden="true" focusable="false">
      {petals.map((a) => (
        <path key={a} d="M0 0 C-11 -12 -11 -34 0 -50 C11 -34 11 -12 0 0 Z" transform={`rotate(${a})`} opacity={a === -14 || a === 14 ? 1 : 0.72} />
      ))}
      <path d="M-48 8 q24 -14 48 0 q24 -14 48 0" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Radiating sun rays behind the logo medallion. */
export function SunRays({ className }: P) {
  const rays = Array.from({ length: 48 }, (_, i) => i * 7.5);
  return (
    <svg className={className} viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      {rays.map((a, i) => (
        <path
          key={a}
          d={i % 2 ? "M-3 -330 L0 -490 L3 -330 Z" : "M-5 -330 L0 -430 L5 -330 Z"}
          fill="currentColor"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="320" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle r="300" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 8" />
    </svg>
  );
}

/** Repeating diamond-and-dot chain band (echoes ikat / pattachitra borders). */
export function PatternBand({ className, id = "band" }: P & { id?: string }) {
  return (
    <svg className={className} width="100%" height="28" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="56" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 4 L38 14 L28 24 L18 14 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="28" cy="14" r="2.2" fill="currentColor" />
          <circle cx="4" cy="14" r="1.6" fill="currentColor" />
          <path d="M0 14 H12 M44 14 H56" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill={`url(#${id})`} />
    </svg>
  );
}

/** Lattice (jali) pattern panel — used as an illustrative, clearly non-photographic image. */
export function JaliPanel({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="jali" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 2 L38 20 L20 38 L2 20 Z" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="6" strokeWidth="1" />
          <circle cx="20" cy="20" r="1.6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#jali)" />
    </svg>
  );
}

/** Ikat-inspired stepped band. */
export function IkatPanel({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="currentColor" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="ikat" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M25 4 l7 7 l-7 7 l-7 -7 Z M25 32 l7 7 l-7 7 l-7 -7 Z" />
          <path d="M4 25 h6 M40 25 h6" stroke="currentColor" strokeWidth="2" />
          <rect x="22" y="22" width="6" height="6" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#ikat)" />
    </svg>
  );
}

export function Arrow({ className }: P) {
  return (
    <svg className={className} width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M0 6h16M11 1l5 5-5 5" />
    </svg>
  );
}
