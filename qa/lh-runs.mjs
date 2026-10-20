// Repeated Lighthouse runs (default mobile profile: simulated Slow 4G, 4x CPU slowdown; desktop preset for desktop).
import { execSync } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";
const url = process.env.URL || "http://localhost:3100/";
const n = Number(process.env.N || 5);
const tag = process.env.TAG || "t";
process.env.CHROME_PATH = chromium.executablePath();
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
for (const form of ["mobile", "desktop"]) {
  const rows = [];
  for (let i = 1; i <= (form === "mobile" ? n : Math.min(n, 3)); i++) {
    const out = `qa/lh-${tag}-${form}-${i}.json`;
    const preset = form === "desktop" ? "--preset=desktop" : "";
    execSync(`npx --yes lighthouse ${url} ${preset} --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=${out} --quiet`, { stdio: "ignore" });
    const r = JSON.parse(fs.readFileSync(out, "utf8"));
    const a = r.audits, c = r.categories;
    rows.push({ perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100), lcp: a["largest-contentful-paint"].numericValue, fcp: a["first-contentful-paint"].numericValue, tbt: a["total-blocking-time"].numericValue, cls: a["cumulative-layout-shift"].numericValue, bytes: a["total-byte-weight"].numericValue, lcpEl: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 60) });
    fs.unlinkSync(out);
  }
  console.log(`\n${form} (${rows.length} runs)`);
  console.table(rows.map((r) => ({ ...r, lcp: (r.lcp / 1000).toFixed(2) + "s", fcp: (r.fcp / 1000).toFixed(2) + "s", tbt: Math.round(r.tbt) + "ms", cls: r.cls.toFixed(3), bytes: Math.round(r.bytes / 1024) + "KB" })));
  console.log("median LCP", (med(rows.map((r) => r.lcp)) / 1000).toFixed(2) + "s", "| worst LCP", (Math.max(...rows.map((r) => r.lcp)) / 1000).toFixed(2) + "s", "| best", (Math.min(...rows.map((r) => r.lcp)) / 1000).toFixed(2) + "s");
}
