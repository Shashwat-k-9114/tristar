# TRISTAR — tristar1947.com

Three food worlds (Biryani · Samosa · Thali) at Kali Mandir Road, Jharsuguda, Odisha. Static-first Next.js 16 / React 19 / Tailwind 4 / GSAP site. **Status: homepage approval checkpoint — supporting pages are not built yet. Nothing is deployed or committed.**

## Run

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build && npm start  # production (QA scripts expect port 3100: `npx next start -p 3100`)
```

## Where things live

| Path | What |
|---|---|
| `src/content/site.ts` | Verified business facts. `null` = unknown, never invented. Edit here; UI, metadata and JSON-LD follow. |
| `src/content/home.ts` | Homepage copy (segments, dishes). |
| `src/app/page.tsx` | The six scenes. |
| `src/app/globals.css` | Design tokens + every scene's CSS. |
| `src/components/brand/` | Logo components; `paths.ts` is **generated**. |
| `src/components/scenes/Art.tsx` | Original vector illustrations (placeholders for photography). |
| `src/components/Motion.tsx` | Scroll choreography (GSAP loaded on first interaction). |
| `scripts/make-logos.py` | Generates all logo SVGs + `paths.ts` (`python scripts/make-logos.py <fontDir>`; needs `fonttools`, OFL font files). |
| `scripts/make-brand-raster.mjs` | Icons, favicon, OG image from the logo SVGs. |
| `docs/` | Audit, identities, budgets, media inventory/shot list, SEO foundation, visual QA report. Legacy Odia direction archived in `docs/legacy-odia-direction/`. |
| `qa/` | Playwright/axe/Lighthouse scripts and screenshots. |

## QA commands (against `next start -p 3100`)

```bash
node qa/shoot.mjs            # desktop + mobile screenshots, console errors, overflow
node qa/behaviour.mjs        # reduced motion, no-JS, menu, keyboard, links, SEO basics
node qa/axe.mjs              # axe-core WCAG 2.x A/AA
N=5 TAG=x node qa/lh-runs.mjs   # repeated Lighthouse (mobile default profile + desktop)
```

## Preview deployment (needs owner approval — not done)

1. Owner approves the homepage direction (see `docs/06-visual-qa-report.md` → "Approvals needed").
2. `vercel` (preview, **not** `--prod`) from `site/`; test on the preview URL (Lighthouse, real phone, Search Console off).
3. Production only after explicit approval, DNS for tristar1947.com, then Search Console / Bing Webmaster verification.

Fonts: Bricolage Grotesque, Rozha One, Syne, Instrument Serif — all SIL OFL 1.1, self-hosted via `next/font`.
