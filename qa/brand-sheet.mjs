// Renders docs/assets/brand-sheet.png: the badge family, palette, type, pattern and application moods.
// Uses the running site for fonts, CSS and the badge sprite.   node qa/brand-sheet.mjs   (server on :3100)
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.add("full"));
const sw = [["Ivory", "#f7efdf"], ["Paper", "#efe3c8"], ["Sand", "#ebd7a8"], ["Saffron", "#d9a044"], ["Brass", "#9a7226"], ["Clay", "#c4714b"], ["Terracotta", "#a5432a"], ["Terracotta deep", "#7a2e1a"], ["Indigo", "#233456"], ["Indigo deep", "#1a2542"], ["Olive", "#5f6b38"], ["Deep brown", "#2a1810"]];
const badge = (k, px, seal = false) => `<svg class="badge badge-${k}" viewBox="0 0 400 400" style="width:${px}px;height:${px}px"><use href="#${seal ? "bd-seal" : "bd-" + k}"/></svg>`;
const names = { tristar: "TRISTAR · parent", biryani: "Biryani · terracotta, petal ring", samosa: "Samosa · indigo, diamond ring", thali: "Thali · brass, bead ring" };
const html = `<div id="sheet" style="width:1600px;background:#f7efdf;color:#2a1810;padding:56px 64px;font-family:var(--font-ui)">
<style>#sheet h4{font:500 12px var(--font-ui);letter-spacing:.26em;text-transform:uppercase;color:#7a2e1a;margin:0 0 16px}#sheet .row{display:flex;gap:28px;align-items:flex-start}#sheet .cap{font-size:13px;margin-top:8px;text-align:center}#sheet .lbl{position:absolute;bottom:-28px;left:0;font-size:12px}</style>
<div style="display:flex;justify-content:space-between;align-items:end;border-bottom:1px solid #9a7226;padding-bottom:18px;margin-bottom:34px"><div><h4 style="margin:0">TRISTAR · brand system · concept stage</h4><div style="font:600 46px var(--font-display)">One family, four emblems</div></div><div style="font-size:13px;max-width:430px;text-align:right">Original work inspired by the design language of the owner's references. No reference artwork is traced or reused.</div></div>
<div class="row" style="justify-content:space-between">${["tristar", "biryani", "samosa", "thali"].map((k) => `<div style="width:340px">${badge(k, 340)}<div class="cap"><b>${names[k]}</b></div></div>`).join("")}</div>
<div style="margin-top:34px;background:var(--band) repeat-x center / auto 20px;height:20px"></div>
<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:48px;margin-top:34px">
 <div><h4>Palette</h4><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${sw.map(([n, h]) => `<div><div style="height:64px;background:${h};border:1px solid rgba(42,24,16,.2);border-radius:6px"></div><div style="font-size:12px;margin-top:6px;font-weight:500">${n}</div><div style="font-size:11px;opacity:.75">${h}</div></div>`).join("")}</div>
 <h4 style="margin-top:30px">Seal sizes (header / favicon / print)</h4><div class="row" style="align-items:center">${[96, 64, 44, 32, 20].map((p) => badge("tristar", p, true)).join("")}</div></div>
 <div><h4>Type</h4><div style="font:600 54px/1.05 var(--font-display);color:#a5432a">Biryani,</div><div style="font:600 54px/1.05 var(--font-display);color:#233456">samosa</div><div style="font:600 54px/1.05 var(--font-display);color:#8a6516">and thali.</div>
 <div style="font:400 38px var(--font-samosa);margin-top:14px;color:#233456">Samosa headings · Rozha One</div>
 <div style="font:500 26px var(--font-odia);margin-top:10px;color:#7a2e1a">ବିରିୟାନୀ · ସମୋସା · ଥାଳି <span style="font:400 12px var(--font-ui)">(draft — to be proof-read)</span></div>
 <div style="font:400 17px/1.7 var(--font-ui);margin-top:12px;max-width:520px">Body: Hind. Headlines and badge lettering: Fraunces 600. Samosa headings: Rozha One. Odia script flourish: Noto Sans Oriya.</div></div></div>
<h4 style="margin-top:44px">Applications — mood only. No TRISTAR premises exist yet; these are layout studies, not photography.</h4>
<div class="row" style="justify-content:space-between;margin-bottom:20px">
 <div style="width:370px;height:250px;border-radius:10px;background:linear-gradient(180deg,#6b4527,#4a2d18);display:grid;place-items:center;position:relative;box-shadow:inset 0 0 0 8px #3b2417, inset 0 0 0 10px #9a7226"><div style="display:flex;align-items:center;gap:16px;color:#f7efdf">${badge("tristar", 96, true)}<div><div style="font:600 34px var(--font-display);letter-spacing:.2em">TRISTAR</div><div style="font-size:11px;letter-spacing:.3em;color:#f0d9a5">BIRYANI · SAMOSA · THALI</div></div></div></div>
 <div style="width:300px;height:250px;border-radius:10px;background:#233456;position:relative;overflow:hidden"><div style="position:absolute;left:34px;top:48px">${badge("samosa", 92)}</div><div style="position:absolute;left:150px;top:64px;color:#f7efdf;font-size:12px;letter-spacing:.2em">NAME · STAFF</div><div style="position:absolute;left:0;right:0;bottom:0;height:78px;background:repeating-linear-gradient(135deg,#a5432a 0 10px,#f7efdf 10px 14px,#233456 14px 28px)"></div></div>
 <div style="width:300px;height:250px;border-radius:10px;background:#c9a06a;display:grid;place-items:center;position:relative"><div style="background:#e5c690;padding:26px 22px;border-radius:6px;box-shadow:0 10px 24px -14px #000">${badge("biryani", 130)}</div></div>
 <div style="width:370px;height:250px;border-radius:10px;background:#2a1810;position:relative;padding:22px;color:#f7efdf;box-shadow:inset 0 0 0 6px #6b4527"><div style="display:flex;gap:16px;align-items:center">${badge("thali", 84)}<div><div style="font:600 28px var(--font-display)">Menu board</div><div style="font:500 20px var(--font-odia);color:#f0d9a5">ବିରିୟାନୀ · ସମୋସା · ଥାଳି</div></div></div><div style="margin-top:18px;font-size:14px;line-height:2;letter-spacing:.14em;color:#f0d9a5">CHICKEN BIRYANI<br>MUTTON SAMOSA · VEGETABLE SAMOSA<br>THALI — CONTENTS TO BE CONFIRMED</div></div>
</div>
<div class="row" style="justify-content:space-between;font-size:12px"><div style="width:370px">Fascia signboard</div><div style="width:300px">Uniform: chest patch + ikat-style hem</div><div style="width:300px">Packaging: kraft box + round seal</div><div style="width:370px">Menu board (no prices — none supplied)</div></div>
<div style="height:30px"></div></div>`;
await page.evaluate((h) => { [...document.body.children].forEach((c) => { if (!c.classList.contains("badge-sprite")) c.remove(); }); document.body.style.cssText = "margin:0;background:#f7efdf"; document.body.insertAdjacentHTML("beforeend", h); }, html);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.locator("#sheet").screenshot({ path: "docs/assets/brand-sheet.png" });
await b.close();
console.log("sheet ok");
