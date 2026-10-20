# TRISTAR — tristar1947.com

Three food identities (Biryani · Samosa · Thali) under one Odia-heritage parent brand, at Kali Mandir Road, Jharsuguda, Odisha. Static-first Next.js 16 / React 19 / Tailwind 4 / GSAP site. **Status: homepage approval checkpoint — supporting pages are not built yet. Nothing is deployed or committed.**

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
| `src/components/brand/Badges.tsx` | The badge system: one SVG sprite (`BadgeSprite`), `<Badge kind="tristar|biryani|samosa|thali" />`, header lockup. |
| `src/components/Ornament.tsx` | Arrow and Konark-wheel primitives. |
| `src/components/Motion.tsx` | Scroll choreography (GSAP loaded on first interaction; off under reduced motion). |
| `scripts/make-brand-raster.mjs` | Icon, apple icon, favicon, OG image from the seal (needs `next start -p 3100` running). |
| `scripts/make-badge-lettering.py` | Outlines the emblem lettering from the OFL fonts into `lettering.ts` (run after a build; see the script header). |
| `docs/` | **`09-odia-heritage-direction.md` is current** (audit, art direction, brand system, QA). 02–04 and 06 are superseded (neon); 05 media inventory/shot list and 07 SEO foundation still apply. Archives: `legacy-odia-direction/`, `legacy-neon-direction/`, `legacy-divine-direction/`. |
| `qa/` | Playwright/axe/Lighthouse scripts and screenshots. |

## QA commands (against `next start -p 3100`)

```bash
node qa/shoot.mjs            # desktop + mobile screenshots, console errors, overflow
node qa/behaviour.mjs        # reduced motion, no-JS, menu, keyboard, links, SEO basics
node qa/axe.mjs              # axe-core WCAG 2.x A/AA
N=5 TAG=x node qa/lh-runs.mjs   # repeated Lighthouse (run nothing else alongside it) (mobile default profile + desktop)
```

## Preview deployment (done once, protected)

Project `tristar-heritage-preview` (Vercel, separate from the existing `tristar` project), Vercel Authentication on all deployments, previews are `noindex`. URL, access and the incident note: `docs/09-odia-heritage-direction.md` §10. Redeploy a preview with `vercel deploy` from `site/` (**never** `--prod` without owner approval; production DNS for tristar1947.com is untouched). Only a Vercel *production* deployment is indexable and hides the draft Odia text (`isProduction` in `src/content/site.ts`).

Fonts: Fraunces, Hind, Rozha One, Noto Sans Oriya — all SIL OFL 1.1, self-hosted via `next/font`.
