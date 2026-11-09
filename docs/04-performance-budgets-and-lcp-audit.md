> **SUPERSEDED (2026-10-20):** this document describes the neon/cinematic direction, which the client has discarded. The current direction is documented in `docs/09-odia-heritage-direction.md`. Kept for the record only.

# 04 · Performance budgets and mobile LCP audit

## A. Budgets (enforced before any heavy media is integrated)

Budgets are per route, **transfer size (compressed)** unless noted, measured on the production build.

| Resource | Budget | Current homepage | Notes |
|---|---|---|---|
| HTML (document) | ≤ 30 KB gz | ~19 KB | Includes inline SVG art + JSON-LD. |
| CSS (all) | ≤ 15 KB gz | ~11 KB | One render-blocking stylesheet. |
| JS, first load (framework + app) | ≤ 150 KB gz | ~140 KB | Next/React baseline dominates. App code is small; logo geometry is server-only. |
| JS, deferred (GSAP + ScrollTrigger) | ≤ 60 KB gz, **only after first interaction**, never under reduced motion | loaded on demand | Must not execute before LCP. |
| Fonts, **critical** (preloaded) | ≤ 45 KB woff2 total | ~40 KB (3 files) | Rozha One, Syne 800, Instrument Serif italic — the three hero words. |
| Fonts, total | ≤ 100 KB woff2 | ~81 KB | Adds Bricolage (41 KB, not preloaded). |
| Images, hero (above the fold) | **0 images** until real photography; then ≤ 120 KB mobile / ≤ 200 KB desktop, AVIF/WebP via `next/image` with `priority` on exactly one | 0 | LCP is text. |
| Images, any single below-fold | ≤ 150 KB; lazy | n/a | |
| Video (hero, optional) | ≤ 1.2 MB mobile (≤ 720p), ≤ 3 MB desktop; `preload="none"`; starts after LCP; poster ≤ 80 KB always present; disabled under reduced-motion and Save-Data | none | See doc 05. |
| OG image | ≤ 150 KB | 141 KB | |
| Total page weight at load (mobile Lighthouse) | ≤ 350 KB | ~272 KB | Lighthouse `total-byte-weight`. |
| Main-thread TBT (mobile lab) | ≤ 300 ms | see §C | |
| CLS | ≤ 0.05 | 0.000 | |
| LCP (mobile lab, Lighthouse default simulated Slow 4G + 4× CPU) | ≤ 2.5 s | see §C | Reported as median **and** spread of repeated runs. |

Design rules that protect the budget
1. The LCP element is **text** (the h1 word "BIRYANI"). It never starts at `opacity: 0`, never waits for JS, images or video.
2. Hero effects are CSS-only and animate `transform`/`opacity` only; no filter, box-shadow or blend-mode sits on an animated node.
3. Ambient loops (steam, ring spin) are `paused` until `load` + idle.
4. GSAP loads on first scroll/touch/key/pointer; all content is complete HTML without it.
5. One weight/style per display face; only hero faces are preloaded; the body face is size-adjusted and unpreloaded.
6. Any new media must come with an inventory row (doc 05) and fit this table, or the budget is revised explicitly.

## B. Critical rendering path (hero)

```
HTML (19 KB)  ─┬─ CSS (11 KB, render-blocking)
               ├─ preload font: Rozha One 400  (10 KB)  ← LCP word
               ├─ preload font: Syne 800       (14 KB)
               ├─ preload font: Instrument Serif it (16 KB)
               └─ JS chunks (low priority, async): framework + header + footer
First paint  = hero text in size-adjusted fallback → swaps to the brand face when loaded (no layout shift: next/font fallback metrics)
Deferred     = GSAP/ScrollTrigger, ambient CSS loops, Bricolage body face
```

Changes made for mobile LCP (versus the first implementation of this direction)
- Dropped the 48-glyph Odia font and the 1254² PNG medallion (old LCP element).
- Body font changed to `preload: false` (removed a 75 KB preload competing with CSS/hero fonts; the opsz axis was also dropped, 75 KB → 41 KB).
- Neon glow: from `filter: drop-shadow` on animated strokes (re-filtered every frame) → static blurred copy + crisp animated copy.
- Ambient steam/ring loops paused until idle.
- Grain: SVG `feTurbulence` data-URI → 2 KB pre-rendered tile; large box-shadows on `.slash`/`.ring` removed.
- Steam layers reduced (5 → 2 on mobile), radial falloff softened.

## C. Measurements

See `docs/06-visual-qa-report.md` §3 for the full table. Methodology: production build (`next build && next start`), Lighthouse 12 default mobile profile (Moto G Power emulation, simulated Slow 4G 150 ms RTT / 1.6 Mbps, 4× CPU slowdown) via `qa/lh-runs.mjs`, 5 repeated runs, fresh Chrome per run; median and range reported. Desktop = Lighthouse desktop preset (3 runs). **Not yet done:** a real-device run, WebPageTest, Vercel preview with real CDN/HTTP2, CrUX field data (site not live).

## D. Known limits of the lab numbers

- Lighthouse in headless Chromium uses a software GPU (SwiftShader). The trace shows the GPU process is the first-paint bottleneck for the neon/atmosphere layers; real phones rasterise this far faster. PageSpeed Insights also uses software rendering, so lab-visible GPU cost is still worth minimising — but it is not the same as field performance.
- Results vary run-to-run on this machine; single-run claims are not made.
