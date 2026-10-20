// Sequential, single-process probe: layout/style/script cost during load under 4x CPU throttle, with one CSS feature disabled at a time.
import { chromium } from "@playwright/test";
const base = "http://localhost:3100/";
const o = (v, f = "Georgia,serif") => `:root{${v}:${f} !important}`;
const variants = {
  base: "",
  "force-full": "main > *,.footer,.cv{content-visibility:visible !important}",
  "no-jost": o("--font-ui", "system-ui,sans-serif"),
  "no-wordmark-font": o("--font-wordmark"),
  "no-biryani-font": o("--font-biryani"),
  "no-samosa-font": o("--font-samosa"),
  "no-thali-font": o("--font-thali"),
  "no-display-font": o("--font-display"),
  "no-subbrand-fonts": o("--font-biryani") + o("--font-samosa") + o("--font-thali") + o("--font-wordmark"),
};
const browser = await chromium.launch();
const reps = Number(process.env.REPS || 3);
for (const [name, css] of Object.entries(variants)) {
  const rows = [];
  for (let i = 0; i < reps; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    if (css) await page.route(base, async (route) => { const r = await route.fetch(); let b = await r.text(); b = b.replace("</head>", `<style>${css}</style></head>`); await route.fulfill({ response: r, body: b }); });
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const m = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
    const lcp = await page.evaluate(() => new Promise((res) => new PerformanceObserver((l) => res(l.getEntries().at(-1).startTime)).observe({ type: "largest-contentful-paint", buffered: true })));
    rows.push({ lcp: Math.round(lcp), style: Math.round(m.RecalcStyleDuration * 1000), styleN: m.RecalcStyleCount, layout: Math.round(m.LayoutDuration * 1000), layoutN: m.LayoutCount, script: Math.round(m.ScriptDuration * 1000), task: Math.round(m.TaskDuration * 1000) });
    await ctx.close();
  }
  const med = (k) => rows.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(rows.length / 2)];
  console.log(name.padEnd(22), `LCP ${med("lcp")}ms | style ${med("style")}ms (${med("styleN")}x) | layout ${med("layout")}ms (${med("layoutN")}x) | script ${med("script")}ms | task ${med("task")}ms`);
}
await browser.close();
