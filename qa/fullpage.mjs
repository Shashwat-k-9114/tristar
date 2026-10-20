// Full-page screenshots for the visual-review package. Scrolls the page first so every scroll reveal has played.
//   BASE=http://localhost:3100 OUT=qa/review-package node qa/fullpage.mjs
import { chromium } from "@playwright/test";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:3100";
const out = process.env.OUT || "qa/review-package";
const extra = process.env.EXTRA_HEADERS ? JSON.parse(process.env.EXTRA_HEADERS) : undefined;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const [name, w, h, dsf] of [["desktop-1440", 1440, 900, 1], ["tablet-768", 768, 1024, 1], ["mobile-390", 390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, isMobile: w < 700, hasTouch: w < 700, extraHTTPHeaders: extra });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => ["error", "warning"].includes(m.type()) && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h * 0.5) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(220); }
  await p.waitForTimeout(2600);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${name}-fullpage.png`, fullPage: true });
  console.log(name, "height", H, "errors", JSON.stringify(errs));
  await ctx.close();
}
await b.close();
