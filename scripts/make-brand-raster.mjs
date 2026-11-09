/**
 * Renders raster brand assets for the concept stage, using the running production site
 * (so the real self-hosted fonts are used):  npx next start -p 3100  then  node scripts/make-brand-raster.mjs
 * Outputs: src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico, public/brand/tristar-logo-512.png, public/og.png
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const base = process.env.BASE || "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(base, { waitUntil: "networkidle" });
const render = async (html, w, h, out) => {
  await page.setViewportSize({ width: w, height: h });
  await page.evaluate((h) => { [...document.body.children].forEach((c) => { if (!c.classList.contains("badge-sprite")) c.remove(); }); document.body.insertAdjacentHTML("beforeend", h); document.body.style.cssText = "margin:0;overflow:hidden"; }, html);
  await page.evaluate(() => document.fonts.load('600 40px Fraunces').catch(() => {}));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out });
};
const seal = (px, kind = "tristar", useSeal = true) => `<svg class="badge badge-${kind}" viewBox="0 0 400 400" style="width:${px}px;height:${px}px;display:block"><use href="#${useSeal ? "bd-seal" : "bd-" + kind}"/></svg>`;
const icon = (s) => `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;background:#f7efdf">${seal(s * 0.92)}</div>`;
await render(icon(512), 512, 512, path.join(root, "src/app/icon.png"));
await render(icon(180), 180, 180, path.join(root, "src/app/apple-icon.png"));
await render(icon(512), 512, 512, path.join(root, "public/brand/tristar-logo-512.png"));
await render(icon(48), 48, 48, path.join(root, "scripts/.fav.png"));
const png = await sharp(path.join(root, "scripts/.fav.png")).ensureAlpha().png().toBuffer();
const hdr = Buffer.alloc(22);
hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4);
hdr.writeUInt8(48, 6); hdr.writeUInt8(48, 7); hdr.writeUInt16LE(1, 10); hdr.writeUInt16LE(32, 12);
hdr.writeUInt32LE(png.length, 14); hdr.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, "src/app/favicon.ico"), Buffer.concat([hdr, png]));
fs.unlinkSync(path.join(root, "scripts/.fav.png"));

await render(`<div style="position:relative;width:1200px;height:630px;background:radial-gradient(60% 80% at 78% 45%,rgba(217,160,68,.28),transparent 70%),#f7efdf;color:#2a1810;font-family:var(--font-ui)">
  <div style="position:absolute;left:80px;top:70px;font-size:22px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:#7a2e1a">TRISTAR · Jharsuguda</div>
  <div style="position:absolute;left:80px;top:130px;font-family:var(--font-display);font-weight:600;font-size:104px;line-height:1.02;letter-spacing:-.015em"><span style="color:#a5432a">Biryani,</span><br><span style="color:#233456">samosa</span><br><span style="color:#8a6516">and thali.</span></div>
  <div style="position:absolute;left:80px;bottom:52px;font-size:20px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:#7a2e1a">Kali Mandir Road · Opening soon</div>
  <div style="position:absolute;right:70px;top:80px">${seal(470, "tristar", false)}</div>
</div>`, 1200, 630, path.join(root, "public/og.png"));
await browser.close();
console.log("ok");
