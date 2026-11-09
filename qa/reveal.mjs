import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage();
const gsapReqs = [];
p.on("request", (r) => /chunks/.test(r.url()) && gsapReqs.push(r.url().slice(-20)));
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
const before = gsapReqs.length;
await p.mouse.wheel(0, 700); await p.waitForTimeout(1200);
console.log("chunks before scroll:", before, "after first scroll:", gsapReqs.length, "(gsap loaded on interaction:", gsapReqs.length > before, ")");
const h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 700; y < h; y += 500) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(350); }
await p.waitForTimeout(1500);
const stuck = await p.evaluate(() => [...document.querySelectorAll("[data-reveal],[data-wipe]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99 || getComputedStyle(e).clipPath.includes("100%")).length);
console.log("elements still hidden after scrolling through page:", stuck);
await b.close();
