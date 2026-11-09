/**
 * Original vector illustrations for each food world. These are graphic art, NOT photographs
 * of the restaurant's food: authentic photography replaces/overlays them once shot
 * (docs/07-production-shot-list.md). All decorative → aria-hidden.
 */
const deco = { "aria-hidden": true as const, focusable: false as const };

/** Handi with the lid lifted: steam wisps and heat rings rise from the opening. */
export function HandiArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} {...deco}>
      <g fill="none" stroke="var(--ember)" strokeWidth="2">
        <circle className="heat-ring" cx="300" cy="300" r="150" />
        <circle className="heat-ring" cx="300" cy="300" r="150" />
        <circle className="heat-ring" cx="300" cy="300" r="150" />
      </g>
      <g className="handi-steam" fill="none" stroke="var(--bone)" strokeWidth="9" strokeLinecap="round" opacity="0.7">
        <path d="M215 300C170 250 250 215 205 160S240 70 200 20" />
        <path d="M290 292C245 242 335 205 288 150S325 62 285 8" stroke="var(--gold)" />
        <path d="M365 300C320 250 410 215 362 160S398 70 358 20" />
        <path d="M430 308C395 268 455 238 422 196" stroke="var(--ember)" />
      </g>
      {/* handles */}
      <g fill="none" stroke="var(--copper)" strokeWidth="16" strokeLinecap="round">
        <path d="M112 352Q58 352 58 396Q58 440 114 440" />
        <path d="M488 352Q542 352 542 396Q542 440 486 440" />
      </g>
      {/* body */}
      <path d="M104 332Q104 556 300 556Q496 556 496 332Z" fill="var(--copper)" />
      <path d="M150 372Q158 506 252 530" fill="none" stroke="var(--gold)" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
      <g stroke="rgba(10,8,6,0.35)" strokeWidth="4" fill="none">
        <path d="M118 412Q300 440 482 412" />
        <path d="M140 470Q300 500 460 470" />
      </g>
      <path d="M84 312H516V342H84Z" fill="var(--gold)" />
      {/* lifted lid */}
      <g transform="translate(92 -78) rotate(-14 300 312)">
        <path d="M130 312Q130 196 300 196Q470 196 470 312Z" fill="var(--ember)" />
        <path d="M170 296Q180 236 260 220" fill="none" stroke="var(--gold)" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
        <path d="M276 160H324V196H276Z" fill="var(--gold)" />
      </g>
    </svg>
  );
}

/** Two samosas in profile: one whole, one broken to show the filling. Hard angles, no curves. */
export function SamosaArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 560" className={`samosa-art ${className ?? ""}`} {...deco}>
      <defs>
        <pattern id="crisp" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <path d="M0 7H14" stroke="rgba(10,8,6,0.28)" strokeWidth="2" />
        </pattern>
      </defs>
      {/* whole samosa (back) */}
      <g transform="translate(250 30)">
        <path d="M0 330L170 0L340 330Z" fill="var(--fry)" />
        <path d="M0 330L170 0L340 330Z" fill="url(#crisp)" />
        <path d="M0 330L170 0L340 330Z" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="miter" />
      </g>
      {/* broken samosa (front), filling revealed */}
      <g transform="translate(30 190)">
        <path d="M0 340L190 40L380 340Z" fill="var(--bone)" />
        <path d="M0 340L190 40L380 340Z" fill="url(#crisp)" opacity="0.7" />
        <path d="M120 150L190 40L260 150L226 138L204 182L178 140Z" fill="var(--ink)" />
        <path d="M126 148L190 48L254 148L224 138L204 176L178 138Z" fill="var(--pink)" />
        <path d="M150 168L190 112L230 168L208 196L190 160L168 198Z" fill="var(--gold)" />
        <path d="M0 340L190 40L380 340Z" fill="none" stroke="var(--ink)" strokeWidth="5" />
      </g>
      {/* crumbs */}
      <g fill="var(--bone)" stroke="var(--ink)" strokeWidth="3">
        <path className="crumb" d="M120 150l26-10l-8 26z" />
        <path className="crumb" d="M470 440l30 8l-20 18z" />
        <path className="crumb" d="M300 470l22-12l6 24z" />
        <path className="crumb" d="M70 90l18 10l-14 16z" />
      </g>
    </svg>
  );
}

/** Overhead thali: plate, six bowls, a ring of rhythmic dots. Bowls are unlabelled — contents are not yet confirmed. */
export function ThaliArt({ className }: { className?: string }) {
  const bowls = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [300 + 168 * Math.cos(a), 300 + 168 * Math.sin(a)] as const;
  });
  const dots = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5 * Math.PI) / 180;
    return [300 + 276 * Math.cos(a), 300 + 276 * Math.sin(a)] as const;
  });
  const tones = ["var(--bronze)", "var(--lime)", "var(--forest)", "var(--bronze)", "var(--lime)", "var(--forest)"];
  return (
    <svg viewBox="0 0 600 600" className={className} {...deco}>
      <g className="plate-dots" fill="var(--bronze)">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={i % 4 === 0 ? 5 : 2.5} />
        ))}
      </g>
      <circle cx="300" cy="300" r="252" fill="var(--forest)" stroke="var(--bronze)" strokeWidth="6" />
      <circle cx="300" cy="300" r="236" fill="none" stroke="var(--lime)" strokeWidth="2" />
      <g className="plate-bowls">
        {bowls.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="66" fill="#07140d" stroke="var(--lime)" strokeWidth="4" />
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="46" fill={tones[i]} opacity="0.85" />
          </g>
        ))}
      </g>
      <circle cx="300" cy="300" r="74" fill="var(--lime)" />
      <circle cx="300" cy="300" r="52" fill="none" stroke="var(--forest)" strokeWidth="4" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...deco}>
      <path d="M3 12h17M14 5l7 7-7 7" />
    </svg>
  );
}
