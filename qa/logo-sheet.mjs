import { chromium } from "@playwright/test";
import path from "path"; import { pathToFileURL } from "url"; import fs from "fs";
const d = path.resolve("public/brand");
const names = ["tristar-mark","tristar-wordmark","tristar-lockup","biryani-logo","samosa-logo","thali-logo"];
const html = `<body style="margin:0;background:#333;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px">` +
  names.map(n => `<img src="${pathToFileURL(path.join(d, n + ".svg"))}" style="width:100%">`).join("") + `</body>`;
const out = path.resolve("qa/shots"); fs.writeFileSync(path.join(out, "logo-sheet.html"), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
await p.goto(pathToFileURL(path.join(out, "logo-sheet.html")).href);
await p.screenshot({ path: path.join(out, "logo-sheet.png"), fullPage: true }); await b.close();
