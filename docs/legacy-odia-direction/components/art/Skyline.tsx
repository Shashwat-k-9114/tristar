/**
 * Original, procedurally drawn silhouettes in the Kalinga temple idiom:
 * a curvilinear tower (rekha deula) with amalaka + kalasa + finial, and a
 * stepped pyramidal hall (pidha deula). Pure SVG, no raster, scales cleanly.
 */

function Deula({ x, w, h, fill, rib }: { x: number; w: number; h: number; fill: string; rib: string }) {
  const top = -h * 0.8;
  const body = `M ${-w / 2} 0 C ${-w / 2} ${-h * 0.3} ${-w * 0.4} ${-h * 0.62} ${-w * 0.2} ${top} L ${w * 0.2} ${top} C ${w * 0.4} ${-h * 0.62} ${w / 2} ${-h * 0.3} ${w / 2} 0 Z`;
  const ribs = [-0.3, -0.15, 0, 0.15, 0.3].map((k) => {
    const x0 = k * w * 1.1;
    const x1 = k * w * 0.6;
    return `M ${x0} 0 C ${x0} ${-h * 0.3} ${x1} ${-h * 0.6} ${x1 * 0.9} ${top + 4}`;
  });
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={body} fill={fill} />
      {ribs.map((d, i) => (
        <path key={i} d={d} stroke={rib} strokeWidth={1.2} fill="none" opacity={0.5} />
      ))}
      {/* amalaka */}
      <ellipse cx={0} cy={top - h * 0.015} rx={w * 0.27} ry={h * 0.03} fill={fill} />
      <rect x={-w * 0.07} y={top - h * 0.07} width={w * 0.14} height={h * 0.05} fill={fill} />
      {/* kalasa */}
      <ellipse cx={0} cy={top - h * 0.09} rx={w * 0.09} ry={h * 0.035} fill={fill} />
      <path d={`M 0 ${top - h * 0.12} L 0 ${top - h * 0.2}`} stroke={fill} strokeWidth={2} />
      <path d={`M 0 ${top - h * 0.2} l ${w * 0.16} ${h * 0.02} l ${-w * 0.14} ${h * 0.025} Z`} fill={fill} />
    </g>
  );
}

function Pidha({ x, w, h, fill, tiers = 5 }: { x: number; w: number; h: number; fill: string; tiers?: number }) {
  const th = h / (tiers + 1.4);
  const rects = Array.from({ length: tiers }, (_, i) => {
    const tw = w * (1 - i * 0.15);
    return (
      <path
        key={i}
        d={`M ${-tw / 2} ${-i * th} L ${-tw / 2 + tw * 0.04} ${-(i + 1) * th} L ${tw / 2 - tw * 0.04} ${-(i + 1) * th} L ${tw / 2} ${-i * th} Z`}
        fill={fill}
      />
    );
  });
  const tw = w * (1 - tiers * 0.15);
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={-w / 2} y={-th * 0.4} width={w} height={th * 0.4} fill={fill} />
      {rects}
      <ellipse cx={0} cy={-tiers * th - h * 0.04} rx={Math.max(tw / 2, w * 0.16)} ry={h * 0.04} fill={fill} />
      <path d={`M 0 ${-tiers * th - h * 0.08} v ${-h * 0.16}`} stroke={fill} strokeWidth={2} />
    </g>
  );
}

export type SkylineLayer = "far" | "mid" | "near";

const LAYERS: Record<SkylineLayer, { fill: string; rib: string }> = {
  far: { fill: "#4a2a1c", rib: "#6a3d28" },
  mid: { fill: "#34201a", rib: "#4f3226" },
  near: { fill: "#1d0f0a", rib: "#2e1a12" },
};

export function Skyline({ layer, className }: { layer: SkylineLayer; className?: string }) {
  const { fill, rib } = LAYERS[layer];
  return (
    <svg
      className={className}
      viewBox="0 0 1600 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {layer === "far" && (
        <g transform="translate(0 420)">
          <Deula x={160} w={120} h={250} fill={fill} rib={rib} />
          <Pidha x={300} w={150} h={120} fill={fill} tiers={4} />
          <Deula x={640} w={140} h={290} fill={fill} rib={rib} />
          <Pidha x={790} w={160} h={110} fill={fill} tiers={4} />
          <Deula x={1180} w={130} h={270} fill={fill} rib={rib} />
          <Pidha x={1330} w={150} h={120} fill={fill} tiers={4} />
          <Deula x={1520} w={110} h={220} fill={fill} rib={rib} />
          <rect x={0} y={-10} width={1600} height={10} fill={fill} />
        </g>
      )}
      {layer === "mid" && (
        <g transform="translate(0 420)">
          <Pidha x={60} w={140} h={130} fill={fill} tiers={4} />
          <Deula x={400} w={150} h={330} fill={fill} rib={rib} />
          <Pidha x={560} w={170} h={140} fill={fill} tiers={5} />
          <Deula x={980} w={160} h={350} fill={fill} rib={rib} />
          <Pidha x={1140} w={150} h={120} fill={fill} tiers={4} />
          <Pidha x={1470} w={160} h={140} fill={fill} tiers={5} />
          <rect x={0} y={-14} width={1600} height={14} fill={fill} />
        </g>
      )}
      {layer === "near" && (
        <g transform="translate(0 420)">
          <path
            d="M0 0 V-34 C120 -44 220 -30 340 -38 C520 -50 620 -26 800 -34 C980 -42 1100 -52 1260 -36 C1400 -24 1500 -40 1600 -30 V0 Z"
            fill={fill}
          />
        </g>
      )}
    </svg>
  );
}
