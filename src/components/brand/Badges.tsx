/**
 * TRISTAR heritage badge system — original vector work, concept stage.
 *
 * Inspired by the *design language* of the owner's references (circular emblems, ornamental rings,
 * banner ribbons, clay pots, chhatri, Konark wheel, Kalinga temple) — no reference artwork is traced
 * or reused. One family, four emblems:
 *
 *   tristar  parent    petal ring · terracotta-deep · Kalinga temple at sunrise under three stars
 *   biryani  segment   petal ring · terracotta      · lidded clay handi, steam
 *   samosa   segment   diamond ring · indigo         · chhatri over two samosas on a brass plate
 *   thali    segment   bead ring · brass/ochre       · thali and six katoris inside a Konark-wheel halo
 *
 * Each emblem is defined ONCE in a hidden sprite (BadgeSprite, rendered in the layout) and instanced with
 * <Badge kind=… />, so ten placements cost ten <use> nodes, not ten DOM trees. Lettering is live SVG text on
 * arcs (searchable, restylable); colours come from CSS custom properties set per kind in globals.css.
 */

import { lettering } from "./lettering";

export type BadgeKind = "tristar" | "biryani" | "samosa" | "thali";

const N = (v: number) => v.toFixed(2);
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)] as const;
};

/** Rotate a polygon/bezier control list about the origin and emit it as one path command string. */
const rotPath = (pts: [number, number][], deg: number, cmd: (p: string[]) => string) => {
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const sn = Math.sin(t);
  return cmd(pts.map(([x, y]) => `${N(x * c - y * sn)} ${N(x * sn + y * c)}`));
};
const PETAL: [number, number][] = [[0, -158], [8, -166], [8, -178], [0, -188], [-8, -178], [-8, -166]];
const DIAMOND: [number, number][] = [[0, -160], [8, -173], [0, -187], [-8, -173]];
const petal = (deg: number) => rotPath(PETAL, deg, (p) => `M${p[0]}C${p[1]} ${p[2]} ${p[3]}C${p[4]} ${p[5]} ${p[0]}Z`);
const diamond = (deg: number) => rotPath(DIAMOND, deg, (p) => `M${p[0]}L${p[1]} ${p[2]} ${p[3]}Z`);
/** A ring of `n` dots drawn as ONE dashed circle (round caps = dots): 1 node instead of n. */
const DotRing = ({ r, n, size, fill, offsetDots = 0 }: { r: number; n: number; size: number; fill: string; offsetDots?: number }) => {
  const step = (2 * Math.PI * r) / n;
  return <circle r={r} fill="none" stroke={fill} strokeWidth={size} strokeLinecap="round" strokeDasharray={`0.01 ${N(step - 0.01)}`} strokeDashoffset={N(-step * offsetDots)} />;
};

/** Outer ring + inner disc. `pattern` gives each segment its own ornament. Node-light by design: the ornaments are a few
 *  combined paths and dashed circles, because every <Badge> instance clones this whole subtree. */
function Ring({ pattern }: { pattern: "petal" | "diamond" | "bead" }) {
  const even = Array.from({ length: 12 }, (_, i) => i * 30);
  const odd = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
  let ornament: React.ReactNode;
  if (pattern === "bead") {
    ornament = (
      <>
        <DotRing r={173} n={18} size={12.4} fill="var(--petalA)" />
        <DotRing r={173} n={18} size={12.4} fill="var(--petalB)" offsetDots={0.5} />
        <circle r="184" fill="none" stroke="var(--dot)" strokeWidth="1.2" opacity=".7" />
        <circle r="162" fill="none" stroke="var(--dot)" strokeWidth="1.2" opacity=".7" />
      </>
    );
  } else {
    const shape = pattern === "petal" ? petal : diamond;
    ornament = (
      <>
        <path d={even.map(shape).join("")} fill="var(--petalA)" />
        <path d={odd.map(shape).join("")} fill="var(--petalB)" />
        <DotRing r={pattern === "petal" ? 174 : 173} n={24} size={pattern === "petal" ? 4.8 : 4.4} fill="var(--dot)" offsetDots={0.5} />
      </>
    );
  }
  return (
    <>
      <circle cx="200" cy="200" r="198" fill="var(--ring)" />
      <circle cx="200" cy="200" r="193" fill="none" stroke="var(--brass)" strokeWidth="1.4" />
      <g transform="translate(200 200)">{ornament}</g>
      <circle cx="200" cy="200" r="156" fill="var(--disc)" stroke="var(--brass)" strokeWidth="2.4" />
      <circle cx="200" cy="200" r="149" fill="none" stroke="var(--ring)" strokeWidth="1.4" />
      <g transform="translate(200 200)">
        <DotRing r={143} n={60} size={2.4} fill="var(--brass)" />
      </g>
    </>
  );
}

function Ribbon({ kind }: { kind: BadgeKind }) {
  return (
    <g>
      <path d="M26 280 L54 270 L54 318 L26 312 L38 296Z" fill="var(--tail)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M374 280 L346 270 L346 318 L374 312 L362 296Z" fill="var(--tail)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 270 Q200 300 348 270 L348 318 Q200 348 52 318Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M58 276 Q200 305 342 276" fill="none" stroke="var(--brass)" strokeWidth="1.2" />
      <path d="M58 312 Q200 341 342 312" fill="none" stroke="var(--brass)" strokeWidth="1.2" />
      <path d={lettering[`${kind}-ribbon`]} fill="var(--ink)" />
    </g>
  );
}

/** A small olive sprig, mirrored left and right of the central emblem. */
function Sprigs() {
  const sprig = (
    <g fill="var(--olive)" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M0 0 C-7 -14 -5 -30 3 -44" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M-1.5 -10 C-12 -12 -15 -20 -13 -25 C-6 -24 -2 -18 -1.5 -10Z" />
      <path d="M-3 -22 C-13 -26 -15 -34 -12 -38 C-5 -37 -3 -30 -3 -22Z" />
      <path d="M0 -14 C8 -17 14 -14 15 -8 C9 -6 3 -8 0 -14Z" />
      <path d="M3 -32 C10 -36 16 -33 17 -27 C11 -25 5 -27 3 -32Z" />
    </g>
  );
  return (
    <g>
      <g transform="translate(112 214)">{sprig}</g>
      <g transform="translate(288 214) scale(-1 1)">{sprig}</g>
    </g>
  );
}

function Star({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z" transform={`translate(${x} ${y}) scale(${s})`} fill="var(--art2)" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />;
}

/* ── emblems ───────────────────────────────────────────── */
const ln = { fill: "none", stroke: "var(--ink)", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function ArtTristar() {
  return (
    <g>
      <path d="M134 270 A66 66 0 0 1 266 270Z" fill="var(--art2)" opacity=".85" />
      {/* smaller flanking halls */}
      <path d="M140 270 V252 H149 V244 H157 V236 H165 V230 H173 V270Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M260 270 V252 H251 V244 H243 V236 H235 V230 H227 V270Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      {/* the main deul */}
      <path d="M177 270 L180 228 C180 208 186 190 191 178 L209 178 C214 190 220 208 220 228 L223 270Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      <g stroke="var(--ink)" strokeWidth="1.6" opacity=".7">
        <path d="M181 192 H219M180 205 H220M180 218 H220M179 231 H221M178 244 H222M178 257 H222" fill="none" />
      </g>
      <ellipse cx="200" cy="174" rx="17" ry="5.5" fill="var(--art2)" stroke="var(--ink)" strokeWidth="2.2" />
      <path d="M194 169 C194 160 206 160 206 169Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M200 161 V138" {...ln} strokeWidth="2.2" />
      <path d="M200 140 L219 146 L200 153Z" fill="var(--art2)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M118 270 H282" {...ln} strokeWidth="3.2" />
      <Star x={146} y={152} />
      <Star x={254} y={152} />
      <Star x={200} y={112} s={1.1} />
    </g>
  );
}

function ArtBiryani() {
  return (
    <g transform="translate(200 214) scale(1.08) translate(-200 -214)">
      {/* steam */}
      <g {...ln} strokeWidth="2.4" opacity=".7">
        <path d="M184 150 C176 140 192 132 184 120" />
        <path d="M200 146 C192 134 208 126 200 112" />
        <path d="M216 150 C208 140 224 132 216 120" />
      </g>
      {/* lid + finial */}
      <circle cx="200" cy="160" r="5.5" fill="var(--art2)" stroke="var(--ink)" strokeWidth="2.2" />
      <path d="M150 206 C150 180 174 168 200 168 C226 168 250 180 250 206Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M170 196 C176 184 188 180 200 180 C212 180 224 184 230 196" fill="none" stroke="var(--art2)" strokeWidth="2" strokeLinecap="round" />
      {/* body */}
      <path d="M136 206 H264 C272 240 246 274 200 274 C154 274 128 240 136 206Z" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M136 206 H264" {...ln} />
      {/* handles */}
      <path d="M138 216 C118 214 116 242 140 244" {...ln} />
      <path d="M262 216 C282 214 284 242 260 244" {...ln} />
      {/* painted band */}
      <path d="M142 228 H258" fill="none" stroke="var(--art2)" strokeWidth="2.2" />
      <g fill="var(--art2)">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${156 + i * 11} 238 l5 -7 l5 7Z`} />
        ))}
      </g>
      <path d="M160 250 C176 260 224 260 240 250" fill="none" stroke="var(--art2)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function ArtSamosa() {
  const fringe = "q 10.8 12 21.6 0 ".repeat(5);
  return (
    <g>
      {/* chhatri */}
      <path d="M200 106 V96" {...ln} />
      <circle cx="200" cy="93" r="3.6" fill="var(--art2)" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M146 150 C146 122 170 108 200 108 C230 108 254 122 254 150" fill="var(--art1)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d={`M146 150 ${fringe}`} fill="var(--art2)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M200 108 L172 150 M200 108 L186 150 M200 108 L214 150 M200 108 L228 150" fill="none" stroke="var(--art2)" strokeWidth="1.6" opacity=".9" />
      {/* the second samosa, behind */}
      <path d="M224 272 L256 218 L288 272Z" fill="var(--food2)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M236 266 L256 232 L276 266Z" fill="none" stroke="var(--ink)" strokeWidth="1.6" opacity=".55" />
      {/* the main samosa */}
      <path d="M144 272 L196 178 L248 272Z" fill="var(--food)" stroke="var(--ink)" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M160 264 L196 200 L232 264Z" fill="none" stroke="var(--ink)" strokeWidth="1.8" opacity=".6" />
      <g fill="var(--ink)" opacity=".7">
        <circle cx="196" cy="226" r="3" />
        <circle cx="184" cy="246" r="2.4" />
        <circle cx="208" cy="246" r="2.4" />
      </g>
      {/* brass plate */}
      <path d="M118 273 H286" {...ln} strokeWidth="4" />
      <path d="M130 279 H274" fill="none" stroke="var(--brass)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function ArtThali() {
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const [x1, y1] = polar(80, i * 22.5);
    const [x2, y2] = polar(88, i * 22.5);
    const [bx, by] = polar(93, i * 22.5 + 11.25);
    return (
      <g key={i}>
        <path d={`M${N(x1)} ${N(y1)} L${N(x2)} ${N(y2)}`} stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={N(bx)} cy={N(by)} r="2.6" fill="var(--ink)" />
      </g>
    );
  });
  const fills = ["var(--art1)", "var(--art2)", "var(--olive)", "var(--indigo)", "var(--art2)", "var(--art1)"];
  return (
    <g transform="translate(200 198) scale(0.84)">
      <circle r="99" fill="var(--halo)" stroke="var(--ink)" strokeWidth="2.6" />
      <circle r="87" fill="none" stroke="var(--ink)" strokeWidth="1.8" />
      {spokes}
      <circle r="78" fill="var(--plate)" stroke="var(--ink)" strokeWidth="3" />
      <circle r="70" fill="none" stroke="var(--brass)" strokeWidth="2" />
      {fills.map((f, i) => {
        const [x, y] = polar(43, i * 60);
        return (
          <g key={i}>
            <circle cx={N(x)} cy={N(y)} r="17" fill={f} stroke="var(--ink)" strokeWidth="2.2" />
            <circle cx={N(x)} cy={N(y)} r="10" fill="none" stroke="var(--paper)" strokeWidth="1.4" opacity=".7" />
          </g>
        );
      })}
      <circle r="15" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.2" />
      <circle r="7" fill="none" stroke="var(--brass)" strokeWidth="1.6" />
    </g>
  );
}

const defs: Record<BadgeKind, { pattern: "petal" | "diamond" | "bead"; art: () => React.ReactNode }> = {
  tristar: { pattern: "petal", art: ArtTristar },
  biryani: { pattern: "petal", art: ArtBiryani },
  samosa: { pattern: "diamond", art: ArtSamosa },
  thali: { pattern: "bead", art: ArtThali },
};

function Symbol({ kind }: { kind: BadgeKind }) {
  const d = defs[kind];
  return (
    <symbol id={`bd-${kind}`} viewBox="0 0 400 400">
      <Ring pattern={d.pattern} />
      {/* name on an arc: pre-outlined glyphs (see scripts/make-badge-lettering.py) */}
      <path d={lettering[`${kind}-name`]} fill="var(--ink)" />
      {kind !== "thali" && <Sprigs />}
      {d.art()}
      <Ribbon kind={kind} />
    </symbol>
  );
}

/** Compact emblem for the header and small marks: ring + the Kalinga temple, no lettering. */
function SealSymbol() {
  return (
    <symbol id="bd-seal" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="198" fill="var(--ring)" />
      <circle cx="200" cy="200" r="168" fill="var(--disc)" />
      <circle cx="200" cy="200" r="178" fill="none" stroke="var(--brass)" strokeWidth="6" />
      <g transform="translate(200 214) scale(1.5) translate(-200 -200)">
        <ArtTristar />
      </g>
    </symbol>
  );
}

/** Light variant for tiny placements (the hero index): ring + disc + the emblem, no lettering, ornaments or sprigs. */
function MiniSymbol({ kind }: { kind: BadgeKind }) {
  const d = defs[kind];
  return (
    <symbol id={`bd-mini-${kind}`} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="198" fill="var(--ring)" />
      <circle cx="200" cy="200" r="168" fill="var(--disc)" />
      <circle cx="200" cy="200" r="180" fill="none" stroke="var(--brass)" strokeWidth="6" />
      <g transform="translate(200 206) scale(1.12) translate(-200 -200)">{d.art()}</g>
    </symbol>
  );
}

export function BadgeSprite() {
  return (
    <svg width="0" height="0" className="badge-sprite" aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(defs) as BadgeKind[]).map((k) => (
          <Symbol key={k} kind={k} />
        ))}
        <SealSymbol />
        {(["biryani", "samosa", "thali"] as const).map((k) => (
          <MiniSymbol key={k} kind={k} />
        ))}
      </defs>
    </svg>
  );
}

export function Badge({ kind, className = "", seal = false, mini = false }: { kind: BadgeKind; className?: string; seal?: boolean; mini?: boolean }) {
  return (
    <svg className={`badge badge-${kind} ${className}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <use href={seal ? "#bd-seal" : mini ? `#bd-mini-${kind}` : `#bd-${kind}`} />
    </svg>
  );
}

/** Wordmark lockup for the header: seal + spaced capitals. */
export function TristarLockup({ className = "" }: { className?: string }) {
  return (
    <span className={`lockup ${className}`}>
      <Badge kind="tristar" seal className="lockup-mark" />
      <span className="lockup-word">TRISTAR</span>
    </span>
  );
}
