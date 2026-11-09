// Bisect what delays first paint: inject CSS into the HTML <head> via route interception (no throttling).
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100/";
const V = {
  base: "",
  "no-grain": ".grain::after{display:none!important}",
  "no-atmos": ".atmos{display:none!important}",
  "no-anim": "*,*::before,*::after{animation:none!important;transition:none!important}",
  "no-neon": ".neon-sign{display:none!important}",
  "no-shadow": ".hw{text-shadow:none!important}",
  "hide-below": "#worlds,.food,.experience,.visit,footer{display:none!important}",
  "no-worlds-art": ".world svg,.ghost-word{display:none!important}",
  "no-svgs": "svg{display:none!important}",
  "no-slash-ring": ".slash,.ring,.heat{display:none!important}",
  "no-boxshadow": "*{box-shadow:none!important;filter:none!important}",
};
const browser = await chromium.launch({ channel: "chromium", args: ["--no-sandbox"] });
for (const [name, css] of Object.entries(V)) {
  const t = [];
  for (let i = 0; i < 2; i++) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true });
    const page = await ctx.newPage();
    await page.route("**/", async (route) => {
      const res = await route.fetch();
      let body = await res.text();
      body = body.replace("<head>", `<head><style>${css}</style>`);
      await route.fulfill({ response: res, body });
    });
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(4800);
    t.push(await page.evaluate(() => Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1)));
    await ctx.close();
  }
  console.log(name.padEnd(14), t.join(" "));
}
await browser.close();
