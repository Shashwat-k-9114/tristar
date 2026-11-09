import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const b = await chromium.launch();
for (const [n, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const p = await (await b.newContext({ viewport: vp })).newPage();
  await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
  console.log(n, "violations:", r.violations.length);
  for (const v of r.violations) console.log(" -", v.id, v.impact, v.nodes.length, v.nodes.slice(0,3).map(x=>x.target.join(" ")).join(" | "));
}
await b.close();
