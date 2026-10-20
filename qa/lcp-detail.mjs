import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__e = [];
  const push = (type) => (l) => l.getEntries().forEach((e) => window.__e.push([type, Math.round(e.startTime), e.name || e.element?.className?.toString().slice(0, 24) || "", Math.round(e.duration || 0), e.size || 0]));
  for (const t of ["paint", "largest-contentful-paint", "longtask", "layout-shift"]) { try { new PerformanceObserver(push(t)).observe({ type: t, buffered: true }); } catch {} }
  new PerformanceObserver((l) => l.getEntries().forEach((e) => /woff2|\.css/.test(e.name) && window.__e.push(["res", Math.round(e.responseEnd), e.name.split("/").pop().slice(0, 18), 0, e.encodedBodySize]))).observe({ type: "resource", buffered: true });
});
const cdp = await ctx.newCDPSession(page);
if (process.env.CPU) await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.CPU) });
await page.goto(base, { waitUntil: "load" });
await page.waitForTimeout(4000);
const e = await page.evaluate(() => window.__e.sort((a, b) => a[1] - b[1]));
console.log(e.map((x) => x.join("  ")).join("\n"));
await browser.close();
