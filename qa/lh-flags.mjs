// Same page, same Lighthouse mobile profile, only the Chrome GPU flag differs. Sequential.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";
process.env.CHROME_PATH = chromium.executablePath();
const url = process.env.URL || "http://localhost:3100/";
for (const [label, flags] of [["default (SwiftShader GPU process)", "--headless=new --no-sandbox"], ["--disable-gpu (software compositing)", "--headless=new --no-sandbox --disable-gpu"]]) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    execFileSync("npx.cmd", ["--yes", "lighthouse", url, "--only-categories=performance", `--chrome-flags=${flags}`, "--output=json", "--output-path=qa/lhf.json", "--quiet"], { stdio: "ignore", shell: true });
    const a = JSON.parse(fs.readFileSync("qa/lhf.json", "utf8")).audits;
    rows.push([a["first-contentful-paint"].numericValue, a["largest-contentful-paint"].numericValue]);
  }
  console.log(label.padEnd(40), "LCP", rows.map((r) => (r[1] / 1000).toFixed(2)).join(" "), "| FCP", rows.map((r) => (r[0] / 1000).toFixed(2)).join(" "));
}
