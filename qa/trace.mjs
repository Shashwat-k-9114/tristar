// Chrome trace of one throttled mobile load: what the renderer does before first contentful paint.
//   BASE=http://localhost:3100/ node qa/trace.mjs
import { chromium } from "@playwright/test";
import fs from "node:fs";
const url = process.env.BASE || "http://localhost:3100/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
if (process.env.CSS) await page.route("**/*", async (route) => { if (route.request().resourceType() !== "document") return route.continue(); const r = await route.fetch(); return route.fulfill({ response: r, body: (await r.text()).replace("</head>", `<style>${process.env.CSS}</style></head>`) }); });
await b.startTracing(page, { path: "qa/trace.json", categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink.user_timing", "loading", "v8.execute", "cc", "gpu", "viz", "benchmark"] });
await page.goto(url + "?tr=" + Date.now(), { waitUntil: "load" });
await page.waitForTimeout(3500);
await b.stopTracing();
await b.close();
const ev = JSON.parse(fs.readFileSync("qa/trace.json", "utf8")).traceEvents;
const nav = ev.find((e) => e.name === "navigationStart" || (e.name === "firstContentfulPaint"));
const t0 = (ev.find((e) => e.name === "navigationStart")?.ts) ?? Math.min(...ev.filter((e) => e.ts).map((e) => e.ts));
const fcp = ev.find((e) => e.name === "firstContentfulPaint" && e.args?.frame);
const lcp = ev.filter((e) => e.name === "largestContentfulPaint::Candidate");
const ms = (e) => ((e.ts - t0) / 1000).toFixed(0);
console.log("FCP at", fcp ? ms(fcp) : "?", "ms | LCP candidates:", lcp.map((e) => ms(e)).join(", "));
const fcpTs = fcp ? fcp.ts : Infinity;
// main-thread complete events before FCP
const main = ev.filter((e) => e.ph === "X" && e.dur && e.ts < fcpTs && e.ts >= t0);
const tid = (() => { const c = {}; main.forEach((e) => (c[e.pid + ":" + e.tid] = (c[e.pid + ":" + e.tid] || 0) + e.dur)); return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]; })();
const onMain = main.filter((e) => e.pid + ":" + e.tid === tid);
const by = {};
for (const e of onMain) if (["EvaluateScript", "v8.compile", "FunctionCall", "ParseHTML", "UpdateLayoutTree", "Layout", "Paint", "PrePaint", "Layerize", "ParseAuthorStyleSheet", "FireAnimationFrame", "TimerFire", "RunTask", "v8.callFunction", "HitTest", "CompositeLayers", "Commit", "ImageDecodeTask", "Decode Image", "UpdateLayer"].includes(e.name)) { by[e.name] = by[e.name] || { n: 0, ms: 0 }; by[e.name].n++; by[e.name].ms += e.dur / 1000; }
console.table(Object.fromEntries(Object.entries(by).map(([k, v]) => [k, { count: v.n, totalMs: Math.round(v.ms) }])));
console.log("longest main-thread events before FCP:");
onMain.sort((a, b) => b.dur - a.dur).slice(0, 14).forEach((e) => console.log(" ", e.name.padEnd(22), (e.dur / 1000).toFixed(0).padStart(5), "ms @", ms(e), e.args?.data?.url?.split("/").pop()?.slice(0, 30) || e.args?.data?.functionName || ""));
// other processes/threads busy before FCP (GPU, raster, compositor)
const thr = {};
for (const e of main) { const k = `${e.pid}:${e.tid}`; thr[k] = (thr[k] || 0) + e.dur / 1000; }
const names = Object.fromEntries(ev.filter((e) => e.name === "thread_name").map((e) => [`${e.pid}:${e.tid}`, e.args.name]));
console.log("busy ms before FCP by thread:", Object.entries(thr).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${names[k] || k}=${Math.round(v)}`).join(" | "));
