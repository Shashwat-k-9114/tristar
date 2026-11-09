import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100";
const views = [
  ["desktop", { width: 1440, height: 900 }, 1],
  ["mobile", { width: 390, height: 844 }, 2],
];
const sections = ["#worlds", "#biryani", "#samosa", "#thali", "#the-food", "#the-experience", "#visit"];
const browser = await chromium.launch();
for (const [name, viewport, dsf] of views) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf, isMobile: name === "mobile", hasTouch: name === "mobile" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(m.type() + ": " + m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + String(e)));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `qa/shots/${name}-01-hero.png` });
  // scroll gradually so GSAP loads and scrubs run
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += viewport.height * 0.5) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(160); }
  for (const s of sections) {
    await page.evaluate((sel) => { const el = document.querySelector(sel); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 1); }, s);
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `qa/shots/${name}-${s.replace("#", "")}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `qa/shots/${name}-footer.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, "height", h, "hOverflow", overflow, "errors", JSON.stringify(errors));
  await ctx.close();
}
await browser.close();
