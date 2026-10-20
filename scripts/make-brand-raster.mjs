/**
 * Renders raster brand assets from the generated SVG geometry (concept stage).
 *   node scripts/make-brand-raster.mjs <fontDir>
 * Outputs: src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico,
 *          public/brand/tristar-logo-512.png, public/og.png
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { pathToFileURL } from "node:url";

const fontDir = process.argv[2];
if (!fontDir) throw new Error("usage: node scripts/make-brand-raster.mjs <fontDir>");
const root = path.resolve(import.meta.dirname, "..");
const font = (f) => pathToFileURL(path.join(fontDir, f)).href;
const markSvg = fs.readFileSync(path.join(root, "public/brand/tristar-mark.svg"), "utf8");
const wordSvg = fs.readFileSync(path.join(root, "public/brand/tristar-wordmark.svg"), "utf8");
const strip = (svg) => svg.replace(/<rect[^>]*\/>/, ""); // transparent background

const browser = await chromium.launch();
const shot = async (html, w, h, out, transparent = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, omitBackground: transparent });
  await page.close();
};

const iconHtml = (size) => `<body style="margin:0;background:#0a0806;display:grid;place-items:center;width:${size}px;height:${size}px">
  <div style="width:${size * 0.68}px;height:${size * 0.68}px">${strip(markSvg).replace("<svg ", '<svg style="width:100%;height:100%" ')}</div></body>`;

await shot(iconHtml(512), 512, 512, path.join(root, "src/app/icon.png"));
await shot(iconHtml(180), 180, 180, path.join(root, "src/app/apple-icon.png"));
await shot(iconHtml(512), 512, 512, path.join(root, "public/brand/tristar-logo-512.png"));
await shot(iconHtml(48), 48, 48, path.join(root, "scripts/.favicon-48.png"));

// favicon.ico (PNG-in-ICO)
const png = await sharp(path.join(root, "scripts/.favicon-48.png")).ensureAlpha().png().toBuffer();
const hdr = Buffer.alloc(22);
hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4);
hdr.writeUInt8(48, 6); hdr.writeUInt8(48, 7); hdr.writeUInt16LE(1, 10); hdr.writeUInt16LE(32, 12);
hdr.writeUInt32LE(png.length, 14); hdr.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, "src/app/favicon.ico"), Buffer.concat([hdr, png]));
fs.unlinkSync(path.join(root, "scripts/.favicon-48.png"));

// Open Graph 1200x630
const og = `<style>
@font-face{font-family:R;src:url(${font("rozha.ttf")})}
@font-face{font-family:S;src:url(${font("syne.ttf")})}
@font-face{font-family:T;src:url(${font("instr-i.ttf")})}
body{margin:0;width:1200px;height:630px;background:#0a0806;position:relative;overflow:hidden;color:#f3ede2;font-family:system-ui,sans-serif}
.heat{position:absolute;left:-200px;bottom:-220px;width:900px;height:420px;background:radial-gradient(closest-side,rgba(255,106,31,.4),transparent)}
.slash{position:absolute;right:170px;top:-40px;width:110px;height:760px;transform:skewX(-18deg);border-inline:4px solid #ff4b5c;background:rgba(255,75,92,.08);box-shadow:0 0 30px rgba(255,75,92,.5)}
.ring{position:absolute;right:-170px;bottom:-60px;width:520px;height:520px;border:3px solid #c8ff3a;border-radius:50%;opacity:.7}
.w{position:absolute;left:64px;top:56px;width:560px}
.a{position:absolute;left:64px;top:190px;line-height:.9;text-transform:uppercase}
.b{font:72px/1 R;color:#ff6a1f}.s{font:800 56px/1.15 S;color:#ff4b5c;transform:skewX(-8deg);transform-origin:left;margin-top:4px}.t{font:italic 120px/.95 T;color:#c8ff3a;text-transform:none}
.f{position:absolute;left:64px;bottom:44px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;font-size:20px}
</style><body><div class=heat></div><div class=slash></div><div class=ring></div>
<div class=w>${strip(wordSvg)}</div>
<div class=a><div class=b>Biryani</div><div class=s>Samosa</div><div class=t>Thali</div></div>
<div class=f>Kali Mandir Road · Jharsuguda · Opening soon</div></body>`;
await shot(og, 1200, 630, path.join(root, "public/og.png"));
await browser.close();
console.log("brand rasters written");
