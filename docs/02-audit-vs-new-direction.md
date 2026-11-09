> **SUPERSEDED (2026-10-20):** this document describes the neon/cinematic direction, which the client has discarded. The current direction is documented in `docs/09-odia-heritage-direction.md`. Kept for the record only.

# 02 · Audit — existing implementation vs. the new TRISTAR direction

Scope: the previous milestone ("1947 – The Odia Diner", see `01-direction-inventory-and-open-items.md`). The old direction is archived, untouched, in `docs/legacy-odia-direction/`; the old screenshots are in `qa/shots-legacy/`. Nothing was committed or deployed.

## What was reused (technically validated foundation)

| Area | Decision | Notes |
|---|---|---|
| Next 16 + React 19 + Tailwind 4 + TypeScript, static prerender | **Kept** | All routes still prerender as static content. |
| `content/site.ts` "single source of truth, `null` = unknown" pattern | **Kept, rewritten** | Now carries the *verified* partial address (street/city/region/country). Postal code, phone, hours, opening date, map URL remain `null`. |
| `lib/seo.ts` (`buildMetadata`, JSON-LD helpers, canonical/OG/Twitter) | **Kept, rewritten** | `Organization` → `Restaurant`; emits only verified fields. |
| `robots.ts`, `sitemap.ts` | **Kept as-is** | Still list only pages that exist. |
| `JsonLd.tsx` (escapes `<`) | **Kept** | |
| Accessible header: focus-trapped mobile menu, Esc to close, focus return, 48 px target, skip link | **Kept** | Visuals rewritten; behaviour identical. Logo is passed in as a server-rendered prop so logo geometry never ships in the client bundle. |
| "GSAP only after first interaction, skipped under reduced motion, nothing hidden beforehand" | **Kept** | Core performance contract; `Motion.tsx` rewritten with a per-world transition vocabulary. |
| QA harness (`qa/*.mjs`, Playwright, axe, Lighthouse) | **Kept, extended** | New: logo sheet, LCP probes, repeated-run Lighthouse, bisect scripts. |
| Brand-asset policy: logo preserved byte-for-byte; no stock/AI food imagery; honest "photo to come" slots | **Kept** | |

## What was replaced

| Area | Why |
|---|---|
| Cocoa/ivory/terracotta/olive/saffron palette | Heritage-warm, daylight-ceremonial. New brief is neon, nocturnal, cinematic. |
| Cormorant Garamond + Manrope + Noto Sans Oriya | Ceremonial serif and an Odia-script layer no longer apply. Replaced by four deliberately different families (below). |
| Temple skyline, wheel/lotus/jali/ikat SVG art (`components/art/*`) | Culturally specific to the old positioning. Removed (archived). |
| Homepage acts I–V ("Land", "Flavours of the Odia table", "Experience", "Invitation") and all Odia/Pakhala/Dalma/Chhena Poda copy | The restaurant is now three food segments in Jharsuguda. Odia-cuisine copy would be **wrong content** for the new brand and was deleted from the live homepage. |
| Ivory medallion logo in header, hero and footer | The supplied "1947 – The Odia Diner" logo is no longer the parent brand. See "Role of the 1947 logo" in doc 03. |
| `og.png`, `icon.png`, `apple-icon.png`, `favicon.ico` | Regenerated from the new TRISTAR mark (`scripts/make-brand-raster.mjs`). |
| Sections-as-cards rhythm (rounded cards, ivory panels, hero medallion) | The brief explicitly rejects repetitive cards and template layouts. |

## Findings carried over from the old QA that still matter

1. Old mobile LCP was **3.8–4.2 s** because the LCP element was a 1254 px PNG medallion. The new hero has **no image**; the LCP element is text.
2. Old Odia font (97 KB) is gone; the font set is re-budgeted (doc 04).
3. The old build had a dev-only `npm audit` advisory in the ESLint toolchain. Unchanged and deferred (`--force` would downgrade Next).

## Risks created by the new direction (and mitigations)

| Risk | Mitigation |
|---|---|
| Neon/glow effects are expensive to paint on low-end phones | Glow is a static blurred copy; animated nodes never carry a filter; ambient loops are paused until `load` + idle. |
| Skewed/offset display type can fail contrast, overflow or confuse crawlers | Solid fills only, contrast checked; `overflow-x: clip` + overflow test; real text in the DOM; split-letter headings use an `sr-only` full-text sibling. |
| "Photographic" brief with no photography available | Honest, art-directed vector worlds + marked photo slots + shot list (doc 05). No AI/stock imagery substituted. |
| Per-world fonts multiply font bytes | One weight/style per brand face; parent face not preloaded; budget enforced (doc 04). |
