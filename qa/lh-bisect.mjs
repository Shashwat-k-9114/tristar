// Lighthouse-based bisect: a tiny proxy injects CSS variants into the HTML <head>; Lighthouse (mobile default) measures each.
import http from "node:http";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";
process.env.CHROME_PATH = chromium.executablePath();
const V = {
  base: "",
  "steam-hidden": ".steam{visibility:hidden!important}",
  "no-neon-blur": ".neon-glow{display:none!important}",
  "no-slash-ring-heat": ".slash,.ring,.heat{display:none!important}",
  "no-atmos": ".atmos{display:none!important}",
  "no-grain": ".grain::after{display:none!important}",
  "hero-only": "#worlds,.food,.experience,.visit,footer{display:none!important}",
};
const pick = process.argv[2] ? process.argv[2].split(",") : Object.keys(V);
const N = Number(process.env.N || 3);
let port = 3300;
for (const name of pick) {
  const css = V[name];
  const p = port++;
  const srv = http.createServer((q, r) => {
    const o = http.request({ host: "localhost", port: 3100, path: q.url, method: q.method, headers: { ...q.headers, "accept-encoding": "identity" } }, (res) => {
      const ct = res.headers["content-type"] || "";
      if (ct.includes("text/html")) {
        let b = ""; res.on("data", (d) => (b += d)); res.on("end", () => { b = b.replace("<head>", `<head><style>${css}</style>`); const h = { ...res.headers }; delete h["content-length"]; r.writeHead(res.statusCode, h); r.end(b); });
      } else { r.writeHead(res.statusCode, res.headers); res.pipe(r); }
    });
    q.pipe(o);
  }).listen(p);
  const rows = [];
  for (let i = 0; i < N; i++) {
    execSync(`npx --yes lighthouse http://localhost:${p}/ --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=qa/lhb.json --quiet`, { stdio: ["ignore", "ignore", "pipe"] });
    const a = JSON.parse(fs.readFileSync("qa/lhb.json", "utf8")).audits;
    rows.push([a["first-contentful-paint"].numericValue, a["largest-contentful-paint"].numericValue]);
  }
  srv.close();
  console.log(name.padEnd(18), "FCP", rows.map((r) => (r[0] / 1000).toFixed(2)).join(" "), "| LCP", rows.map((r) => (r[1] / 1000).toFixed(2)).join(" "));
}
