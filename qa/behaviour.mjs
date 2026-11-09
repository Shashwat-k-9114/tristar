// Behavioural QA for the TRISTAR homepage: reduced motion, no-JS, mobile menu + keyboard, internal links, SEO basics.
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100";
const b = await chromium.launch();
const out = {};

const hiddenCount = (p) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".copy > *, .art, .dish, .facts div, h1, h2")].filter((e) => {
      const s = getComputedStyle(e);
      return s.opacity === "0" || s.visibility === "hidden" || s.display === "none";
    }).length,
  );

// 1. Reduced motion: GSAP never loads; nothing hidden; ambient animations are off
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  const scripts = [];
  p.on("request", (r) => /gsap|scrolltrigger/i.test(r.url()) && scripts.push(r.url()));
  await p.goto(base, { waitUntil: "networkidle" });
  for (let y = 0; y < 9000; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(80); }
  out.reducedMotion = {
    hiddenElements: await hiddenCount(p),
    animatedElements: await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length),
    gsapRequests: scripts.length,
  };
  await p.screenshot({ path: "qa/shots/reduced-hero.png" });
  await ctx.close();
}
// 2. JS disabled: full content present
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(base);
  out.noJS = {
    h1: (await p.locator("h1").innerText()).replace(/\s+/g, " "),
    hiddenElements: await hiddenCount(p),
    headings: await p.evaluate(() => [...document.querySelectorAll("h2")].map((e) => e.textContent.trim().replace(/\s+/g, " ")).slice(0, 12)),
  };
  await ctx.close();
}
// 3. After a full scroll with motion enabled, nothing is left stuck hidden by GSAP
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); }
  await p.waitForTimeout(2500);
  out.afterScroll = { hiddenElements: await hiddenCount(p) };
  await ctx.close();
}
// 4. Mobile menu + keyboard
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  const btn = p.getByRole("button", { name: "Open menu" });
  const box = await btn.boundingBox();
  out.menuButtonSize = box && `${Math.round(box.width)}x${Math.round(box.height)}`;
  await btn.tap();
  await p.waitForTimeout(400);
  out.menuOpen = await p.locator("#mobile-menu").isVisible();
  await p.screenshot({ path: "qa/shots/mobile-menu.png" });
  await p.keyboard.press("Escape");
  out.menuClosedByEsc = !(await p.locator("#mobile-menu").isVisible());
  out.focusReturned = await p.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  await p.getByRole("button", { name: "Open menu" }).tap();
  await p.locator("#mobile-menu").getByRole("link", { name: /The Food/ }).tap();
  await p.waitForTimeout(1400);
  out.anchorNav = await p.evaluate(() => location.hash + " menuHidden=" + document.getElementById("mobile-menu").hidden);
  await ctx.close();
}
// 5. Desktop: skip link first, internal links all resolve, SEO basics
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  out.firstTab = await p.evaluate(() => document.activeElement?.textContent);
  const tabs = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press("Tab"); tabs.push(await p.evaluate(() => { const e = document.activeElement; return (e?.getAttribute("aria-label") || e?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24); })); }
  out.tabOrder = tabs;
  out.links = await p.evaluate(async () => {
    const hrefs = [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))];
    const res = [];
    for (const h of hrefs) {
      if (h.startsWith("/#")) res.push([h, !!document.getElementById(h.slice(2))]);
      else if (h.startsWith("/")) res.push([h, (await fetch(h)).ok]);
      else res.push([h, "external"]);
    }
    return { total: res.length, broken: res.filter(([, ok]) => ok === false).map(([h]) => h), external: res.filter(([, ok]) => ok === "external").map(([h]) => h) };
  });
  out.seo = await p.evaluate(async () => ({
    sitemap: (await (await fetch("/sitemap.xml")).text()).match(/<loc>[^<]+/g),
    robots: (await (await fetch("/robots.txt")).text()).replace(/\n/g, " | "),
    title: document.title,
    description: document.querySelector("meta[name=description]")?.content,
    canonical: document.querySelector("link[rel=canonical]")?.href,
    robotsMeta: document.querySelector("meta[name=robots]")?.content,
    og: ["og:title", "og:description", "og:image", "og:url"].map((k) => !!document.querySelector(`meta[property="${k}"]`)),
    jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)).flat().map((x) => x["@type"]),
    h1count: document.querySelectorAll("h1").length,
    imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    lang: document.documentElement.lang,
  }));
  await ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
