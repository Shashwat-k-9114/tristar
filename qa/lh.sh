export CHROME_PATH=$(node -e "console.log(require('@playwright/test').chromium.executablePath())")
for f in mobile desktop; do
  if [ $f = desktop ]; then X="--preset=desktop"; else X=""; fi
  npx --yes lighthouse ${URL:-http://localhost:3100} $X --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=qa/lh-$f.json --quiet >/dev/null 2>&1
  node -e "const r=require('./qa/lh-$f.json');const c=r.categories;const a=r.audits;console.log('$f',Object.entries(c).map(([k,v])=>k.slice(0,4)+':'+Math.round(v.score*100)).join(' '),'LCP',a['largest-contentful-paint'].displayValue,'FCP',a['first-contentful-paint'].displayValue,'CLS',a['cumulative-layout-shift'].displayValue,'TBT',a['total-blocking-time'].displayValue)"
done
