// One throttled load (1.6 Mbps / 150 ms RTT, 4x CPU): resource waterfall + paint timings + main-thread task summary.
import { chromium } from "@playwright/test";
const url = process.env.BASE || "http://localhost:3100/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Performance.enable");
await page.goto(url + "?wf=" + Date.now(), { waitUntil: "load" });
await page.waitForTimeout(2000);
const out = await page.evaluate(() => ({
  paints: performance.getEntriesByType("paint").map((p) => `${p.name} ${Math.round(p.startTime)}`),
  lcp: performance.getEntriesByType("largest-contentful-paint").map((e) => `${e.element?.tagName}.${(e.element?.className || "").toString().slice(0, 20)} ${Math.round(e.startTime)}`),
  res: performance.getEntriesByType("resource").map((r) => ({ n: r.name.split("/").slice(-1)[0].slice(0, 34), t: r.initiatorType, start: Math.round(r.startTime), end: Math.round(r.responseEnd), kb: +(r.encodedBodySize / 1024).toFixed(1), dec: +(r.decodedBodySize / 1024).toFixed(1) })),
  nav: (({ responseStart, responseEnd, domInteractive, domContentLoadedEventEnd, loadEventEnd }) => ({ responseStart, responseEnd, domInteractive, dcl: domContentLoadedEventEnd, load: loadEventEnd }))(performance.getEntriesByType("navigation")[0].toJSON()),
}));
const m = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
console.log("paints", out.paints.join(" | "), "\nlcp", out.lcp.join(" | "), "\nnav", JSON.stringify(Object.fromEntries(Object.entries(out.nav).map(([k, v]) => [k, Math.round(v)]))));
console.table(out.res);
console.log("script", Math.round(m.ScriptDuration * 1000), "layout", Math.round(m.LayoutDuration * 1000), "style", Math.round(m.RecalcStyleDuration * 1000), "task", Math.round(m.TaskDuration * 1000));
await b.close();
