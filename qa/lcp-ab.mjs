// Sequential A/B probe of mobile LCP/FCP. One Chromium context at a time, CDP network (1.6 Mbps / 150 ms RTT) and 4x CPU throttling
// (the same targets as Lighthouse mobile, but applied, not simulated). Variants edit the served HTML/CSS via request interception.
//   BASE=http://localhost:3100/ REPS=5 node qa/lcp-ab.mjs [variantName ...]
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100/";
const reps = Number(process.env.REPS || 5);
const css = (c) => (html) => html.replace("</head>", `<style>${c}</style></head>`);
const fontsOff = ":root{--font-display:Georgia,serif !important;--font-ui:system-ui,sans-serif !important;--font-samosa:Georgia,serif !important;--font-odia:sans-serif !important}";
const variants = {
  base: { html: (h) => h },
  "no-webfonts": { html: css(fontsOff + ".badge-name,.badge-ribbon{font-family:Georgia,serif!important}") },
  "no-hero-badge": { html: css(".hero-badge{display:none!important}") },
  "no-hero-glow-wheel": { html: css(".hero-glow,.hero-wheel{display:none!important}") },
  "no-paper-grain": { html: css(".paper::after{display:none!important}") },
  "flat-backgrounds": { html: css(".hero{background:#f7efdf!important}") },
  "no-hero-index": { html: css(".hero-index,.hero .band{display:none!important}") },
  "no-below-fold": { html: css("main>*:not(.hero),.footer{display:none!important}") },
  "all-decor-off": { html: css(".hero-badge,.hero-glow,.hero-wheel,.hero-index,.hero .band{display:none!important}.paper::after{display:none!important}.hero{background:#f7efdf!important}") },
  "no-text-wrap-balance": { html: css("h1,h2,h3{text-wrap:wrap!important}") },
  "no-container-type": { html: css(".badge-stage{container-type:normal!important}") },
  "no-cv-class": { html: css(".cv{content-visibility:visible!important}") },
  "full-from-start": { html: (h) => h.replace("<html ", '<html data-x="1" ').replace('class="', 'class="full ') },
  "no-badges-anywhere": { html: css(".badge{display:none!important}") },
  "no-family-section": { html: css(".family{display:none!important}") },
  "no-badge-text": { html: css(".badge-name,.badge-ribbon{display:none!important}") },
  "no-javascript": { html: (h) => h, blockScripts: true },
  "no-js-no-below-fold": { html: css("main>*:not(.hero),.footer{display:none!important}"), blockScripts: true },
};
const want = process.argv.slice(2);
const names = want.length ? want : Object.keys(variants);
const browser = await chromium.launch();
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
for (const name of names) {
  const v = variants[name];
  const rows = [];
  for (let i = 0; i < reps; i++) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Performance.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.route("**/*", async (route) => {
      const req = route.request();
      if (v.blockScripts && req.resourceType() === "script") return route.abort();
      if (req.resourceType() === "document") {
        const r = await route.fetch();
        return route.fulfill({ response: r, body: v.html(await r.text()) });
      }
      return route.continue();
    });
    await page.addInitScript(() => {
      window.__m = {};
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime; }).observe({ type: "paint", buffered: true });
    });
    await page.goto(base + `?r=${name}${i}`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => window.__m);
    const pm = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
    const bytes = await page.evaluate(() => performance.getEntriesByType("resource").reduce((a, e) => a + (e.transferSize || 0), 0));
    rows.push({ lcp: m.lcp ?? NaN, fcp: m.fcp ?? NaN, kb: bytes / 1024, layout: pm.LayoutDuration * 1000, style: pm.RecalcStyleDuration * 1000, script: pm.ScriptDuration * 1000 });
    await ctx.close();
  }
  const f = (k) => rows.map((r) => r[k]).filter((x) => !Number.isNaN(x));
  console.log(
    name.padEnd(22),
    `LCP median ${Math.round(med(f("lcp")))} ms [${Math.round(Math.min(...f("lcp")))}–${Math.round(Math.max(...f("lcp")))}]`,
    `| FCP ${Math.round(med(f("fcp")))} | ${Math.round(med(f("kb")))} KB | layout ${Math.round(med(f("layout")))} style ${Math.round(med(f("style")))} script ${Math.round(med(f("script")))} ms`,
  );
}
await browser.close();
