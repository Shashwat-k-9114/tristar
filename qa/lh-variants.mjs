// Sequential, controlled LCP experiments. One proxy, one Lighthouse process at a time.
// Each variant injects CSS into the HTML <head> via ?v=name. Results are appended to qa/results-lcp-variants.json as they finish.
import http from "node:http";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";
process.env.CHROME_PATH = chromium.executablePath();
const V = {
  base: "",
  "no-grain": ".grain::after{display:none!important}",
  "no-text-shadow": ".hw{text-shadow:none!important}",
  "no-neon-glow-filter": ".neon-glow{display:none!important}",
  "no-steam": ".steam{display:none!important}",
  "no-slash-ring-heat": ".slash,.ring,.heat{display:none!important}",
  "no-atmos-all": ".atmos{display:none!important}",
  "hide-below-fold": "#worlds,.food,.experience,.visit,footer{display:none!important}",
  "content-visibility": "#worlds,.food,.experience,.visit,footer{content-visibility:auto;contain-intrinsic-size:auto 900px}",
  "no-svg-anywhere": "svg{display:none!important}",
  "no-will-change": "*{will-change:auto!important}",
  "nojs": "",
  "system-fonts-hero": ".hw{font-family:Georgia,serif!important}",
  "h1-only": ".atmos,.hero-sign,.hero-foot,header,#worlds,.food,.experience,.visit,footer{display:none!important}",
  "no-hero-effects-at-all": ".atmos,.neon-sign{display:none!important}.grain::after{display:none!important}.hw{text-shadow:none!important}",
};
const pick = process.argv[2] ? process.argv[2].split(",") : Object.keys(V);
const N = Number(process.env.N || 3);
const out = "qa/results-lcp-variants.json";
const results = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
const srv = http.createServer((q, r) => {
  const u = new URL(q.url, "http://x");
  const css = V[u.searchParams.get("v")] || "";
  const o = http.request({ host: "localhost", port: 3100, path: u.pathname, method: "GET", headers: { "accept-encoding": "identity" } }, (res) => {
    const ct = res.headers["content-type"] || "";
    const chunks = []; res.on("data", (d) => chunks.push(d));
    res.on("end", () => {
      let body = Buffer.concat(chunks);
      const h = { ...res.headers }; delete h["content-length"]; delete h["content-encoding"];
      if (ct.includes("text/html")) { let t = body.toString().replace("<head>", `<head><style>${css}</style>`); if (u.searchParams.get("v") === "nojs") t = t.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<link rel="preload" as="script"[^>]*>/g, ""); body = Buffer.from(t); }
      if (/text|javascript|css|json|svg/.test(ct)) { body = zlib.gzipSync(body); h["content-encoding"] = "gzip"; }
      h["content-length"] = body.length; r.writeHead(res.statusCode, h); r.end(body);
    });
  });
  o.end();
}).listen(3300);
for (const name of pick) {
  const rows = [];
  for (let i = 0; i < N; i++) {
    execFileSync("npx.cmd", ["--yes", "lighthouse", `http://localhost:3300/?v=${name}`, "--only-categories=performance", "--chrome-flags=--headless=new --no-sandbox", "--output=json", "--output-path=qa/lhv.json", "--quiet"], { stdio: "ignore", shell: true });
    const a = JSON.parse(fs.readFileSync("qa/lhv.json", "utf8")).audits;
    rows.push({ fcp: Math.round(a["first-contentful-paint"].numericValue), lcp: Math.round(a["largest-contentful-paint"].numericValue), tbt: Math.round(a["total-blocking-time"].numericValue) });
  }
  results[name] = rows; fs.writeFileSync(out, JSON.stringify(results, null, 1));
  const l = rows.map((r) => r.lcp).sort((a, b) => a - b);
  console.log(name.padEnd(24), "LCP s:", rows.map((r) => (r.lcp / 1000).toFixed(2)).join(" "), "| median", (l[Math.floor(l.length / 2)] / 1000).toFixed(2), "| FCP", rows.map((r) => (r.fcp / 1000).toFixed(2)).join(" "));
}
srv.close(); process.exit(0);
