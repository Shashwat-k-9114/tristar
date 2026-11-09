/**
 * TRISTAR identity system — concept stage.
 *
 * Parent: a three-rayed star in a fine ring + a widely spaced serif wordmark.
 * Sub-brands share one construction (glyph, name, hairline, "TRISTAR" endorsement) but each has
 * its own typeface, glyph and shape language:
 *   Biryani  Bodoni Moda italic · the dome of a lidded pot · burgundy
 *   Samosa   Marcellus capitals · a folded triangle         · antique gold
 *   Thali    Fraunces italic     · a plate with its bowls    · olive / earth
 *
 * Wordmarks are live text (accessible, searchable, no raster); glyphs are inline SVG using currentColor.
 */

type P = { className?: string };

const glyph = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

export function TristarMark({ className }: P) {
  /* An arched niche holding three rising lines — the three chapters, and steam. */
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M20 90 V46 A30 30 0 0 1 80 46 V90" strokeWidth="2" />
      <path d="M10 90 H90" strokeWidth="2" />
      <path d="M38 78 V58 M50 78 V40 M62 78 V58" strokeWidth="2.4" />
    </svg>
  );
}

export function TristarLockup({ className }: P) {
  return (
    <span className={`lockup ${className ?? ""}`}>
      <TristarMark className="lockup-mark" />
      <span className="lockup-word">TRISTAR</span>
    </span>
  );
}

/** Stacked sub-brand logo: glyph · name · hairline · endorsement. */
function SubLogo({ brand, name, glyphEl, className }: { brand: "biryani" | "samosa" | "thali"; name: string; glyphEl: React.ReactNode; className?: string }) {
  return (
    <span className={`sublogo sublogo-${brand} ${className ?? ""}`}>
      <svg className="sublogo-glyph" viewBox="0 0 60 44" aria-hidden="true" focusable="false">
        {glyphEl}
      </svg>
      <span className={`sublogo-name f-${brand}`}>{name}</span>
      <span className="sublogo-rule" aria-hidden="true" />
      <span className="sublogo-by">by TRISTAR</span>
    </span>
  );
}

export function BiryaniLogo({ className }: P) {
  return (
    <SubLogo
      brand="biryani"
      name="Biryani"
      className={className}
      glyphEl={
        <g {...glyph}>
          <circle cx="30" cy="5.5" r="1.6" />
          <path d="M10 36 C10 20 19 11 30 11 C41 11 50 20 50 36 Z" />
          <path d="M6 36 H54" />
        </g>
      }
    />
  );
}

export function SamosaLogo({ className }: P) {
  return (
    <SubLogo
      brand="samosa"
      name="SAMOSA"
      className={className}
      glyphEl={
        <g {...glyph}>
          <path d="M30 4 L52 38 H8 Z" />
          <path d="M30 14 L43 34 H17 Z" opacity=".55" />
        </g>
      }
    />
  );
}

export function ThaliLogo({ className }: P) {
  const bowls = Array.from({ length: 5 }, (_, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [30 + 11.5 * Math.cos(a), 22 + 11.5 * Math.sin(a)] as const;
  });
  return (
    <SubLogo
      brand="thali"
      name="Thali"
      className={className}
      glyphEl={
        <g {...glyph}>
          <circle cx="30" cy="22" r="20" />
          <circle cx="30" cy="22" r="3.4" />
          {bowls.map(([x, y], i) => (
            <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="2.5" />
          ))}
        </g>
      }
    />
  );
}
