import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100";
const widths = [[320, 640], [360, 780], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
const secs = ["hero", "#biryani", "#samosa", "#thali", "#the-experience", "footer"];
const shotW = new Set([390, 768, 1440]);
const b = await chromium.launch();
for (const [w, h] of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => ["error", "warning"].includes(m.type()) && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(2200);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h * 0.5) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(90); }
  const m = await p.evaluate(() => {
    const vw = innerWidth;
    const wide = [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !e.closest("[aria-hidden=true]") && getComputedStyle(e).position !== "fixed"; }).map((e) => e.tagName + "." + String(e.className).slice(0, 30)).slice(0, 6);
    return { docOverflow: document.documentElement.scrollWidth - vw, visibleTextClipped: wide };
  });
  console.log(`${w}x${h}`, JSON.stringify(m), "errors", JSON.stringify(errs));
  if (shotW.has(w)) {
    for (const s of secs) {
      await p.evaluate((sel) => { if (sel === "hero") return window.scrollTo(0, 0); const el = document.querySelector(sel === "footer" ? "footer" : sel); window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 1); }, s);
      await p.waitForTimeout(w >= 768 ? 2400 : 2400);
      await p.screenshot({ path: `qa/shots/w${w}-${s.replace(/[#]/g, "")}.png` });
    }
  }
  await ctx.close();
}
await b.close();
