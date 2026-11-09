// Renders the animated GIFs used in transactional emails into public/email/.
//   wheel.gif — slowly turning Konark-style wheel (seamless loop: the wheel repeats every 22.5°)
//   tick.gif  — a ring that draws itself, then a check mark
// Run:  node scripts/gen-email-assets.mjs
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "email");
mkdirSync(out, { recursive: true });

const BG = "#170b05"; // matches the email hero background
const ORANGE = "#ff9f0a";

const range = (n, step) => Array.from({ length: n }, (_, i) => i * step);
const wheelBody = () => `
  <g fill="none" stroke="${ORANGE}" stroke-width="2.6" opacity=".95">
    <circle r="92"/><circle r="20"/><circle r="8" fill="${ORANGE}"/>
    ${range(16, 22.5).map((a) => `<line x1="0" y1="-20" x2="0" y2="-92" transform="rotate(${a})"/>`).join("")}
  </g>
  <g fill="${ORANGE}" opacity=".75">
    ${range(16, 22.5).map((a) => `<path d="M0,-96 C10,-108 10,-120 0,-130 C-10,-120 -10,-108 0,-96Z" transform="rotate(${a})"/>`).join("")}
    ${range(32, 11.25).map((a) => `<circle cx="0" cy="-140" r="2.8" transform="rotate(${a})"/>`).join("")}
  </g>`;

async function gif(frames, delays, file, size, loop) {
  const bufs = await Promise.all(
    frames.map((svg) => sharp(Buffer.from(svg), { density: 144 }).resize(size, size).flatten({ background: BG }).png().toBuffer()),
  );
  const info = await sharp(bufs, { join: { animated: true } })
    .gif({ delay: delays, loop, effort: 10, colours: 64, dither: 0 })
    .toFile(join(out, file));
  console.log(file, info.size, "bytes", frames.length, "frames");
}

// 1) wheel — 16 frames spanning 22.5° so the loop is seamless
const wheelFrames = range(16, 22.5 / 16).map(
  (deg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 -150 300 300"><rect x="-150" y="-150" width="300" height="300" fill="${BG}"/><g transform="rotate(${deg})">${wheelBody()}</g></svg>`,
);
await gif(wheelFrames, Array(16).fill(70), "wheel.gif", 240, 0);

// 2) tick — ring draws, check draws, hold
const C = 2 * Math.PI * 44;
const tickFrames = [];
const delays = [];
const N = 26;
for (let i = 0; i <= N; i++) {
  const t = i / N;
  const ring = Math.min(t / 0.6, 1);
  const check = Math.max(0, (t - 0.55) / 0.45);
  const glow = Math.min(1, check * 1.2) * 0.18;
  tickFrames.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${BG}"/>
    <circle cx="50" cy="50" r="44" fill="#34c759" fill-opacity="${glow}"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#34c759" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ring)}" transform="rotate(-90 50 50)"/>
    <path d="M30 51 L44 65 L71 36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="64" stroke-dashoffset="${64 * (1 - check)}"/></svg>`);
  delays.push(i === N ? 2500 : 40);
}
await gif(tickFrames, delays, "tick.gif", 160, 3);

// 3) building banner for the email footer (crop of the night photo)
await sharp(join(out, "..", "img", "building-night.jpg"))
  .extract({ left: 0, top: 250, width: 1082, height: 360 })
  .resize(1200, 400)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(out, "building-banner.jpg"));
console.log("building-banner.jpg");
