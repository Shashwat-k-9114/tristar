import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const r = await new AxeBuilder({ page: p }).withRules(["color-contrast"]).analyze();
for (const v of r.violations) for (const n of v.nodes) console.log(n.target.join(" "), "|", n.any[0]?.message);
await b.close();
