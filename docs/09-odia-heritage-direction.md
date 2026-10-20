# 09 · Odia heritage direction — re-audit, art direction, brand system and visual QA

**Status: preview and visual-review package ready (see §10). Classification: PARTIAL** — design, accessibility, SEO and responsiveness pass; mobile LCP is much improved but not proven on a physical phone; the design and the four emblems are *provisionally accepted, not approved*.
Nothing is committed, deployed or published. The other routes (`/biryani`, `/samosa`, `/thali`, `/menu`, `/about`, `/gallery`, `/visit`) are not built.

This supersedes the neon direction (docs 02–04, 06) **and** the short-lived "Divine / quiet luxury" direction (archived in `docs/legacy-divine-direction/`). Both stay in the repo as archives only.

---

## 1. What the references say

Reviewed: 2 JPEGs in `References/`, 4 JPEGs inside the zip (extracted to a scratch folder, never executed), and frames sampled from both videos.

| Reference | What it shows | Design language taken |
|---|---|---|
| Circular "Chilika Banquet" seal | Round badge, thick patterned ring, name on an arc, banner ribbon, scenic centre, pillars, waves | Badge construction: ring → disc → arc lettering → ribbon → illustrated centre |
| "The Kalinga Kitchen · 1947" seal on textured paper | Clay pot with steam, chhatri (umbrella), waves, peacocks, heavy slab lettering, paper grain | Clay handi + chhatri vocabulary; warm paper; "1947" as a heritage number |
| "Utkal Biryani House" seal | Dense terracotta/indigo/cream ring of Pattachitra-style motifs, diya, lidded pot full of biryani, banner | Rich-but-controlled ring ornament; lit lamp; banner |
| Rooftop "Utkal Biryani" environment | Carved wood, copper vessels, lanterns, Konark-wheel set piece, ikat rug, mosaic tables, greenery | Material palette (wood, copper/brass, terracotta), Konark wheel, ornament as architecture |
| Staff / counter images | Indigo shirts with chest seals, ikat hems, block-printed kurta and sari, chalkboard menu in Odia, stone counter with geometric inlay | Indigo as the working colour, ikat-style bands, seals as patches, Odia script on menus |
| Two screen recordings | The owner's own prototype site (dark + gold crown mark, "TRISTAR 1947 — Cuisine & Celebrations") | **Style context only** — see §8: it contains facts that conflict with, or are not in, the verified brief |

Common thread: **emblematic, handcrafted, warm, and culturally specific** — the opposite of both earlier directions.

## 2. Re-audit of the previous homepages against the references

| | Neon cinematic (v1) | Divine / quiet luxury (v2) | Heritage (this build) |
|---|---|---|---|
| Emblematic circular identity | none — wordmarks | a small arch mark | **four badge emblems + seal** |
| Palette | black + neon | espresso, ivory, gold | ivory, terracotta, indigo, saffron, brass, deep brown |
| Culture / place | generic | generic "luxury" | Odia: Kalinga temple, clay handi, chhatri, Konark wheel, Odia script, ikat-style band |
| Ornament | none / glow | hairlines only | one controlled pattern band + ring ornaments |
| Segment differentiation | colour + font | shape + font | emblem, colour, ring pattern, headline face |
| Motion | loud kinetic | slow reveals | slower still: fade-up, badge "pressed like a seal", soft steam |
| Fit to references | none | none | high in spirit; original artwork |

## 3. Art direction

**Principles** — warm, premium, culturally rooted, crafted, refined not flashy. Ornament is rich but contained to rings, one pattern band and small sprigs; **text areas are always plain**. Nothing neon, no aggressive gradients, no kinetic type, no AI imagery.

**Palette** (tokens in `globals.css`): Ivory `#f7efdf` · Paper `#efe3c8` · Sand `#ebd7a8` · Saffron `#d9a044` · Brass `#9a7226` · Clay `#c4714b` · Terracotta `#a5432a` / deep `#7a2e1a` · Indigo `#233456` / deep `#1a2542` · Olive `#5f6b38` (leaves only) · Deep brown `#2a1810` (ink). Text pairs were checked by axe and are all AA.

**Type** — Fraunces 600 (headlines, badge lettering: soft, warm, a little wonky — hand-set feel); Rozha One (Samosa headings: high-contrast, Indic-flavoured); Hind (text and UI — designed in India, neutral and warm); Noto Sans Oriya (the three segment names in Odia script, as a flourish).

**Ornament** — one repeating band (cream strip, terracotta/indigo diamonds, brass hairlines) marks every change of "room"; ring ornaments differ per segment (petals · diamonds · beads); small olive sprigs; a faint Konark wheel behind the hero; a hairline brass dotted ring inside each seal.

**Photography direction (replaces the neon notes in doc 05 §C)** — warm daylight or tungsten, never cold; terracotta, brass and banana-leaf as surfaces; steam and hands in frame; honest, un-retouched food. Biryani: handi opening, steam backlit, rice macro. Samosa: broken open on brass, golden crust close-up. Thali: overhead on brass, bowls full. Environment: wood, copper, ikat, lamps — **only once the real premises exist and are photographed**. Shot IDs B1–B4, S1–S2, T1… are unchanged.

**Motion** — slow, purposeful, once: copy fades up (1.5 s), an emblem settles with a slight turn and scale (2.2 s), a soft glow breathes behind the hero seal (10 s), steam rises over the biryani handi. Transform/opacity only; nothing pinned or hijacked; GSAP is not even downloaded until the first scroll/touch/key; all of it is off under `prefers-reduced-motion`.

## 4. Brand system

| | TRISTAR (parent) | Biryani | Samosa | Thali |
|---|---|---|---|---|
| Emblem | Kalinga temple (deul) at sunrise, three stars | Lidded clay handi, rising steam | Chhatri over two samosas on brass | Thali with six katoris inside a Konark-wheel halo |
| Ring | Petals, deep terracotta | Petals, terracotta | Diamonds, indigo | Beads, brass |
| Ribbon | BIRYANI · SAMOSA · THALI | CHICKEN BIRYANI | MUTTON · VEGETABLE | A COMPLETE MEAL |
| Chapter field | — | Deep terracotta | Indigo | Sand / saffron |
| Headline voice | Fraunces | Fraunces | **Rozha One** | Fraunces |
| Character words | — | Clay pot · Aroma · Steam | Crisp · Golden · Folded | Abundance · Balance · Comfort |
| Application mood | fascia, seal, stationery | packaging seal, handi stamp | uniform chest patch, ikat hem | menu board, brass thali ware |

The emblems live once in a hidden SVG sprite (`BadgeSprite`) and are instanced with `<Badge kind="…" />` — see `src/components/brand/Badges.tsx`. The header uses the compact **seal** (ring + temple, no lettering). Brand sheet with palette, type, seal sizes and application studies: `docs/assets/brand-sheet.png` (`node qa/brand-sheet.mjs`).

**The supplied 1947 logo** is preserved byte-for-byte (`brand-source/`, `public/brand/1947-logo.png`) and is **not used anywhere on the page** (decision of 2026-10-21: no position in the brand hierarchy until its business role is confirmed, to avoid two competing master identities). The section that showed it was removed.

**Category names stay provisional** (Biryani, Samosa, Thali). The reference names (Utkal Biryani House, Kalinga Kitchen, Chilika Banquet) are *not* used.

## 5. Homepage structure

I Arrival (hero, parent seal, three coloured words, three-table index) · II One family (the three emblems) · III–V Biryani / Samosa / Thali chapters · VI The table (four framed photo places) · VII Visit · Footer (parent + three emblems).
H1 `TRISTAR Jharsuguda: Biryani, samosa and thali.`; H2s carry the local keywords ("Chicken biryani in Jharsuguda", "Mutton and vegetable samosa in Jharsuguda", "Thali in Jharsuguda").

## 6. Content honesty

- Only verified facts appear: three segments; chicken biryani, mutton samosa, vegetable samosa; thali (contents unconfirmed); Kali Mandir Road, Jharsuguda, Odisha; opening soon.
- No claim of authenticity, history, awards, years in business, capacity, prices, hours, phone, e-mail or opening date. Unknowns read "to be announced".
- Illustrations are original vector drawings, labelled "Photograph to come · B1…" — not photography and not AI imagery. No premises are depicted.
- Schema (JSON-LD `Restaurant` + `WebSite`) emits verified fields only. Meta description now says "three food identities under one Odisha-inspired roof".
- Odia script: **draft** — ବିରିୟାନୀ, ସମୋସା, ଥାଳି. Shown only on previews and local builds, each with a visible "draft, awaiting native-language review" tag; **never rendered on a production deployment** (`isProduction` in `src/content/site.ts`) until a native reader approves it and the flag is lifted.

## 7. Engineering notes

Kept: Next.js App Router static build, skip link, focus-trapped mobile menu, reduced-motion handling, JSON-LD, sitemap/robots, lazy GSAP. New: badge sprite; `.cv` (content-visibility) on below-the-fold sections, released to normal rendering at idle after load; same-page links use `prefetch={false}`; fonts — Fraunces + Hind on first paint, Rozha One and Noto Sans Oriya only when their sections render. Icon, apple icon, favicon and `og.png` regenerated from the seal (`scripts/make-brand-raster.mjs`). New files: `Badges.tsx`, `Ornament.tsx`, rewritten `globals.css`, `page.tsx`, `SiteHeader/Footer`, `Motion.tsx`.

## 8. Reference-prototype facts NOT adopted (owner to confirm or discard)

The screen recordings show the owner's draft site. It states things that are **not** in the verified brief and, in places, conflict with it: an address in the Cuttack–Puri area (the brief says Jharsuguda), a phone and e-mail, weekly opening hours, dish prices, "75+ years", "500+ guests", an open-terrace banquet, table booking, and named concepts (Utkal Biryani Hall, Kalinga Kitchen, Chilika Banquet). None of it is on the site. Please confirm which, if any, are real and in scope — and note that booking/ordering UI is out of scope by the original brief.

## 9. Visual QA report

### Functional / accessibility / SEO — final build

| Check | Result |
|---|---|
| axe-core (WCAG 2.x A/AA), desktop and mobile | **0 violations** |
| Lighthouse accessibility / best practices / SEO | **100 / 100 / 100** in every run |
| Reduced motion | 0 hidden elements, 0 running animations, GSAP never requested |
| JavaScript disabled | complete content, 0 hidden, H1 + 7 H2s present |
| After a full scroll with motion on | 0 elements stuck hidden |
| Mobile menu | button 48×48, opens, Esc closes, focus returns to the button, anchor link works and closes the panel |
| Keyboard | skip link is first Tab stop; sensible order |
| Internal links | 7 checked, 0 broken |
| Horizontal overflow / clipped text | 0 at 320, 360, 390, 768, 1024, 1440, 1920 |
| Console | 0 errors/warnings in all screenshot passes |
| Metadata | title, description, canonical, robots, Open Graph, Twitter, JSON-LD (`Restaurant`, `WebSite`), sitemap, robots.txt present; 1 H1; 0 images without alt |

### Performance — mobile (Lighthouse default: simulated Slow 4G, 4× CPU), 5 identical sequential runs

| Run | Perf | LCP | FCP | TBT | CLS |
|---|---|---|---|---|---|
| 1 | 63 | 3.65 s | 2.02 s | 995 ms | 0 |
| 2 | 61 | 3.74 s | 1.88 s | 1104 ms | 0 |
| 3 | 67 | 3.33 s | 1.74 s | 888 ms | 0 |
| 4 | 62 | 3.68 s | 1.92 s | 1048 ms | 0 |
| 5 | 67 | 3.52 s | 1.72 s | 886 ms | 0 |

**Median LCP 3.65 s (range 3.33–3.74 s). The ≤ 2.5 s goal is not met.** Page weight 270 KB. The LCP element is the hero lead paragraph (text) — no image, no web-font blocking. Desktop (3 runs, informational only): LCP 0.73–0.85 s, perf 94–98 — **not** a mobile certification.

What was tried this session (all measured, sequential): deferring below-the-fold layout with `content-visibility` (pre-paint layout cost ~−30% in a CPU-throttled probe; Lighthouse median 3.93 → 3.60 s on the earlier build), no prefetch of same-page links, fewer first-paint fonts. A control page (one heading, no JS) scores 0.75–0.81 s on this machine, so the gap is the page, not the machine. Probes showed no single CSS feature (grain, gradients, steam, text-wrap, individual font) responsible; layout cost grows with the amount of web-font text laid out before first paint, and React hydration scripts run before first paint (~1.1 s of script at 4× throttle). **Dominant cause not isolated.**
Caveats, stated plainly: the laptop carries background load from other applications (30–70 % CPU at idle at times), which made two earlier batches noisy (TBT up to 6 s); the batch above was taken at ~32 % background load. The earlier neon build measured 2.98 s median under unknown load, so this build may be genuinely heavier in the lab. **No real-device or production-network measurement exists yet.**

### Screenshots (`qa/shots-heritage/`)

`desktop-*`, `tablet-*`, `mobile-*`, `mobile320-*` — hero, family, biryani, samosa, thali, the table, the 1947 mark, visit, footer; plus `mobile-menu.png`. Brand sheet: `docs/assets/brand-sheet.png`. Open Graph image: `public/og.png`.
Visually reviewed: hero, three chapters, family, table, mark, visit, footer at desktop; hero, biryani, samosa and menu at mobile; biryani at tablet.

### Known defects / open design points

1. Emblem artwork is hand-coded vector at concept quality. It is clean and original but simpler than the references' illustrated detail (no peacocks, waves, dolphins). A commissioned illustrator pass is advisable before print/signage.
2. The three emblems' lettering is live text; at very small sizes (the 3.6 rem hero index) the ribbon text is illegible by design — the index relies on colour and emblem.
3. Photo "places" are empty frames; the page will look sparse in places until photography exists.
4. The supplied 1947 logo has an opaque ivory background (no transparency); it is shown inside a soft circle.
5. The Odia words are draft; the Rozha One / Noto Oriya fonts load late by design (a brief swap may be visible when scrolling fast).
6. Mobile LCP above target (see above).

### Unverified assumptions

Meaning of "1947"; the legal/brand status of the names Biryani/Samosa/Thali; the Odia spellings; that the owner wants the 1947 mark shown on the homepage; thali varieties; everything in §8.

### Outstanding approvals needed

1. Creative direction (this document) — approve, or mark up.
2. Role of the 1947 mark (homepage section / footer only / retire).
3. Odia script: approve the three words (native proof-read).
4. Which §8 prototype facts are real and in scope.
5. Photography plan and budget (doc 05) — the page's biggest remaining gap.
6. Permission for a Vercel **preview** deployment and a real-phone LCP test — the only way to settle the performance question.
7. Final brand names (still provisional).

**Classification: PARTIAL.** Not APPROVED (needs owner sign-off and the LCP result); not BLOCKED (nothing prevents proceeding once the above are answered).

---

## 10. Preview and review package (2026-10-21)

### Decisions applied
1. Direction **provisionally accepted**; design and four emblems **not approved** — hence a visual review.
2. 1947 logo preserved, untouched, **removed from the homepage** (no hierarchy position assigned).
3. Odia text kept as **draft**, gated off production, tagged on previews.
4. Location stays Kali Mandir Road, Jharsuguda, Odisha. No Cuttack–Puri details, phone, hours, prices, banquet, or other prototype claims are on the site.
5. Preview authorised; **no production DNS change, nothing published to tristar1947.com** (that domain received one HTTP request from me, only to confirm it is not part of this work).

### Preview
- **URL:** `https://tristar-heritage-preview-3i6n2chak-shashwats-projects-bd30a0f7.vercel.app` (project `tristar-heritage-preview`, Vercel account `shashwats-projects-bd30a0f7`; a **new** project — the existing `tristar` project was not touched).
- **Protection:** Vercel Authentication on *all* deployments. Anonymous requests get a 302 to Vercel login (verified). Previews are also `noindex` (robots meta + `X-Robots-Tag`) and `robots.txt` is `Disallow: /`.
- **Access:** sign in to Vercel as the project owner (`shashwat-k-9114`) and open the URL. For another reviewer: Vercel dashboard → project → the deployment → **Share** (a time-limited link), or add them to the team.
- **What reviewers see that production will not:** the three draft Odia lines with their "awaiting review" tags; the Vercel preview toolbar.
- **Incident, disclosed:** the project's *first* deployment was automatically assigned to production, and its `*.vercel.app` alias was publicly reachable (HTTP 200) for a few minutes before I enabled protection for all deployments. I then deleted that deployment (its address now returns 404) and redeployed as a true preview. No custom domain was ever attached. A second, temporary production-target deployment (protected) was made only to measure real production-mode performance and was deleted afterwards. The automation bypass secret used for lab runs was revoked and the local copies deleted.

### Package contents (`qa/review-package/`)
`brand-system-sheet.png` (palette, type, four emblems, seal sizes, application studies; also `docs/assets/brand-sheet.png`) · `desktop-1440-fullpage.png` · `tablet-768-fullpage.png` · `mobile-390-fullpage.png` · `open-graph-image.png` · `sections/` (viewport shots of every section, desktop and mobile).

### LCP investigation — method
Applied-throttle probes (`qa/lcp-ab.mjs`: 1.6 Mbps / 150 ms RTT / 4× CPU, one variant at a time, 5 runs each), a Chrome trace of the pre-paint main thread (`qa/trace.mjs`), a waterfall (`qa/waterfall.mjs`), and repeated Lighthouse mobile runs (`qa/lh-runs.mjs`, default Slow-4G + 4× CPU simulation).

### Findings
| Suspect | Finding |
|---|---|
| JavaScript / hydration | **Not the blocker for first paint.** Only ~30 ms of script runs before it; blocking all scripts did not change the applied LCP. It does shape TBT and Lighthouse's *simulated* LCP. |
| Web fonts | Not the blocker: replacing all fonts with system fonts moved LCP by < 0.1 s. Only Fraunces + Hind load for first paint. |
| Hero graphics, glow, wheel, grain, gradients | Individually ≤ 0.1 s each; all decoration off together ≈ −0.15 s. |
| **Layout of below-the-fold content** | **Dominant.** Forcing it all to lay out before paint added ~1.2 s (LCP 2.8–3.1 s vs 1.6–1.8 s). `content-visibility:auto` removes most of it. |
| **Badge SVG weight** | Large: hundreds of nodes per emblem, plus live `<text><textPath>` lettering (−0.46 s when removed). |
| **Odia script line** | **~250 ms of layout** for one word (complex-script shaping and fallback lookup); FCP 1427 → 1195 ms without it. Irrelevant to production (gated off), relevant to previews. |
| Remaining pre-paint cost | One ~150 ms layout of the hero (~730 objects), then ~320–390 ms to lay out the first near-viewport deferred section. The trace shows this is browser layout, not our scripts. |

### Changes made (no visual redesign)
1. Below-the-fold deferral is now released only **after first contentful paint** (it previously fired on `load`, which could precede paint).
2. Ring ornaments rebuilt as combined paths and dashed circles (hundreds of nodes → a handful); emblem lettering **pre-outlined** from the OFL fonts (`scripts/make-badge-lettering.py` → `lettering.ts`) instead of live text-on-path. Visually identical at normal sizes.
3. The three tiny hero-index icons use a lighter "mini" emblem (ring, disc, art; no ornament or lettering). **This is a small visible difference** at 4.4 rem — please check it.
4. Same-page anchors are plain `<a>` elements (no client-router work).
5. Previews and local builds are `noindex` and `robots.txt` disallows all; only a Vercel *production* deployment is indexable (`isProduction`).

### Before → after (mobile Lighthouse, 5 identical sequential runs; median [range])
| Build / environment | LCP | TBT | Page weight | Notes |
|---|---|---|---|---|
| Before (earlier build, local) | **3.65 s** [3.33–3.74] | 886–1104 ms | 270 KB | background load ~32 % |
| After, local, preview-mode (with draft Odia) | 3.05 s [2.99–3.32] | 215–464 ms | 292 KB | SEO 66 by design (noindex) |
| After, local, production-mode (no Odia) | **2.93 s** [2.86–3.07] | 300–596 ms | 251 KB | perf 78–88; SEO 100; a11y/BP 100 |
| **After, real Vercel CDN, production flags** (temporary protected deployment, since deleted) | **2.55 s** [2.36–2.94] | 315–1199 ms | 231 KB | perf 69–89; SEO 92 (see note) |
| After, real Vercel **preview** URL (what reviewers see) | 3.79 s [3.55–4.99] | 537–2790 ms | 272 KB | includes draft Odia + Vercel toolbar scripts; noisy |

Note on SEO 92: Lighthouse requests `robots.txt` without the bypass header and receives the login redirect (anonymous `robots.txt` → 302, verified); with the header it returns `Allow: /`. Production on a public domain would not show this.
Desktop (informational only): LCP 0.60–0.85 s, perf 94–99 in every environment.
Applied-throttle probe with the same changes: LCP ≈ 1.77 s → 1.43 s; hero-only floor ≈ 1.0 s.

### Unresolved / honest limits
- **No physical Android phone was available** (`adb` is not installed and no device is attached). **Every number above is lab or emulation — none is physical-device evidence.** To obtain it: on a mid-range Android phone open Chrome and load a production-mode URL, or run PageSpeed Insights against a public deployment; or connect the phone by USB, enable USB debugging, and use Chrome DevTools → Remote devices (I can run Lighthouse that way once a device is attached).
- LCP target (≤ 2.5 s): within noise on the real CDN (median 2.55 s, 2 of 5 runs under 2.5 s), **not** met by the local simulation (2.93 s). Treat the real-CDN median as "borderline".
- A 4× CPU slowdown on a fast laptop is not a mid-range phone; Lighthouse's simulated LCP is more pessimistic than the applied-throttle probe (≈ 1.4 s). The real-device result could land on either side.
- The preview includes draft Odia text, which is slower than production by design.
- Emblem artwork remains concept-level (see §9 defects); the lighter mini icons in the hero index are a change to review.

### Regression results after the changes (preview-mode build)
axe 0 violations (desktop + mobile) · reduced motion: 0 hidden, 0 running animations, GSAP never requested · JS disabled: complete, 0 hidden · full scroll: 0 stuck hidden · mobile menu 48×48, Esc closes, focus returns, anchors work · skip link first · 0 broken links · 0 overflow or clipped text at 320/360/390/768/1024/1440/1920 · 0 console errors · 1 H1, 0 images without alt, JSON-LD `Restaurant` + `WebSite` · Lighthouse accessibility and best-practices 100 in every run.

### Approvals / actions still needed
1. Visual review of the preview and the brand-system sheet — approve, or send mark-ups on the four emblems.
2. Role of the 1947 mark (currently unused).
3. Native proof-read of the Odia words.
4. Photography plan (doc 05).
5. A physical Android device (or the owner's phone) for the real-device LCP test.
6. Final brand names.
