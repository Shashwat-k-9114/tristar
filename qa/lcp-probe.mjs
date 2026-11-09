// Relative LCP experiments: CPU 4x throttle, optional slow-4G network, CSS variants injected before paint.
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100/";
const variants = {
  base: "",
  "no-animations": "*,*::before,*::after{animation:none!important}",
  "no-neon-filter": ".neon-sign{filter:none!important}",
  "no-steam": ".steam{display:none!important}",
  "no-shadows": ".hw{text-shadow:none!important}.slash,.ring{box-shadow:none!important}",
  "no-atmos": ".atmos{display:none!important}",
  "no-grain": ".grain::after{display:none!important}",
};
const only = process.argv[2] ? process.argv[2].split(",") : Object.keys(variants);
const browser = await chromium.launch();
for (const name of only) {
  const res = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await page.addInitScript((css) => {
      window.__lcp = []; window.__fcp = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push([Math.round(e.startTime), e.element?.className?.toString().slice(0, 30), e.size]))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => e.name === "first-contentful-paint" && (window.__fcp = Math.round(e.startTime)))).observe({ type: "paint", buffered: true });
      if (css) document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); });
    }, variants[name]);
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(4500);
    const r = await page.evaluate(() => ({ fcp: window.__fcp, lcp: window.__lcp }));
    res.push(`FCP ${r.fcp} LCP ${r.lcp.map((x) => x[0]).join(">")}`);
    await ctx.close();
  }
  console.log(name.padEnd(16), res.join(" | "));
}
await browser.close();
