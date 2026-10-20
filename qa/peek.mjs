import { chromium } from "@playwright/test";
const [,, w="1440", h="900", tag="d"] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width:+w, height:+h }, deviceScaleFactor: 1, isMobile:+w<700, hasTouch:+w<700 });
const page = await ctx.newPage();
const errs=[]; page.on("console",m=>["error","warning"].includes(m.type())&&errs.push(m.text())); page.on("pageerror",e=>errs.push(String(e)));
await page.goto("http://localhost:3100",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
await page.screenshot({path:`qa/shots-premium/${tag}-hero.png`});
const H = await page.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H;y+=+h*0.4){await page.evaluate(v=>window.scrollTo(0,v),y);await page.waitForTimeout(250);}
for (const s of ["#family-title","#biryani","#samosa","#thali","#the-food","#visit"]) {
  await page.evaluate(sel=>{const e=document.querySelector(sel);window.scrollTo(0,e.getBoundingClientRect().top+scrollY-(sel.endsWith("-title")?150:0));},s);
  await page.waitForTimeout(2800);
  await page.screenshot({path:`qa/shots-premium/${tag}-${s.replace(/[#-]/g,"")}.png`});
}
await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(1500);
await page.screenshot({path:`qa/shots-premium/${tag}-footer.png`});
console.log(tag,"H",H,"overflow",await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),errs);
await browser.close();
