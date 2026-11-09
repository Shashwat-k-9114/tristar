import { chromium } from "@playwright/test";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true });
const p = await ctx.newPage();
const c = await ctx.newCDPSession(p);
await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await c.send("Performance.enable");
await c.send("Tracing.start", { traceConfig: { includedCategories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] } }).catch(()=>{});
const events = [];
c.on("Tracing.dataCollected", (d) => events.push(...d.value));
await p.goto(process.argv[2] || "http://localhost:3100", { waitUntil: "load" });
await p.waitForTimeout(3000);
const m = Object.fromEntries((await c.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
console.log({ Layout: m.LayoutDuration.toFixed(3), Recalc: m.RecalcStyleDuration.toFixed(3), Script: m.ScriptDuration.toFixed(3), Task: m.TaskDuration.toFixed(3), LayoutCount: m.LayoutCount, RecalcCount: m.RecalcStyleCount, Nodes: m.Nodes });
await c.send("Tracing.end"); await new Promise(r=>setTimeout(r,1500));
const agg = {};
for (const e of events) if (e.ph === "X" && e.dur > 20000) { agg[e.name] = (agg[e.name] || 0) + e.dur / 1000; }
console.log(Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>k+":"+Math.round(v)+"ms").join("\n"));
await b.close();
