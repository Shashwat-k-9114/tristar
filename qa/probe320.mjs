import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 320, height: 640 } })).newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => [...document.querySelectorAll("footer *")].filter((e) => e.getBoundingClientRect().right > 321).map((e) => e.tagName + "." + String(e.className.baseVal ?? e.className).slice(0, 25) + " r=" + Math.round(e.getBoundingClientRect().right) + " w=" + Math.round(e.getBoundingClientRect().width)).join("\n")));
await b.close();
