> **SUPERSEDED (2026-10-20):** this document describes the neon/cinematic direction, which the client has discarded. The current direction is documented in `docs/09-odia-heritage-direction.md`. Kept for the record only.

# 06 · Visual QA report — TRISTAR homepage (approval checkpoint)

**Classification: PARTIAL.**
Everything functional, accessible, crawlable and responsive that could be tested passed on the final production build. **Mobile LCP does not meet the ≤ 2.5 s goal** (median 2.98 s, range 2.92–3.49 s over 5 identical Lighthouse runs), and the dominant cause was **not** isolated. The creative direction is **not self-approved**; it is presented for client review (§9).

Build under test: `next build` + `next start -p 3100` from a clean `.next`, after the last code change (mobile-menu Samosa sizing). tsc and ESLint clean. Nothing committed, deployed or touched in production. Raw outputs are in `qa/results-*.{txt,json,log}`.

## 1. Summary

| Area | Result |
|---|---|
| Production build, tsc, ESLint | ✅ clean |
| Console errors/warnings (7 widths) | ✅ 0 |
| Horizontal overflow (320, 360, 390, 768, 1024, 1440, 1920) | ✅ 0 (after fixing one 320 px footer defect) |
| axe-core WCAG 2.0/2.1/2.2 A+AA + best-practice, desktop and mobile | ✅ 0 violations (after fixing one defect) |
| Lighthouse accessibility / best practices / SEO (mobile) | ✅ 100 / 100 / 100 in all 5 runs |
| Reduced motion, JS disabled, post-scroll visibility, mobile menu, keyboard, links | ✅ pass (§4) |
| Metadata, canonical, OG, robots, sitemap, JSON-LD | ✅ intact (§6) |
| **Mobile LCP ≤ 2.5 s** | ❌ **not met** (§5) |
| Mobile TBT / perf score | ⚠ TBT 382–950 ms; perf score 67–85 |
| Desktop (informational only — **not** a mobile certification) | LCP 0.71–0.76 s, perf 95–97 |

## 2. Screenshots inspected (all in `qa/shots/`)

| Width | Files |
|---|---|
| 1440 (desktop) | `w1440-hero`, `-biryani`, `-samosa`, `-thali`, `-the-experience`, `-footer` |
| 768 (tablet) | `w768-hero`, `-biryani`, `-samosa`, `-thali`, `-the-experience`, `-footer` |
| 390 (mobile) | `w390-hero`, `-biryani`, `-samosa`, `-thali`, `-the-experience`, `-footer`; `mobile-menu` |
| Other | `reduced-hero` (reduced motion). Logo sheet: `docs/assets/logo-sheet.png` |
Widths 320/360/1024/1920 were checked programmatically (overflow, clipping, console) but not screenshotted. Screenshots are static frames: scroll-scrubbed transitions and hover states were **not** captured mid-motion.

Visual findings from inspection (defects found → fixed → re-inspected):

| # | Finding | Status |
|---|---|---|
| V1 | Samosa title letters wrapped to two lines and overlapped the paragraph | Fixed (container-query sizing, no wrap); re-inspected at 1440/768/390 |
| V2 | Samosa panel showed the wordmark logo **and** the kinetic "SAMOSA" title (duplicate) | Fixed by removing the logo from that panel (**design decision to confirm**, §9) |
| V3 | Experience-scene kinetic words clipped at 390 ("CRUNC", "Abundanc") | Fixed (container-relative sizes, smaller slide amplitude); re-inspected |
| V4 | Footer heading collided with the Samosa logo at 768 | Fixed (12-column footer now starts at ≥ 1024) |
| V5 | Footer overflowed 24 px at 320 (invisible because of `overflow: clip`) | Fixed; re-verified 0 overflow |
| V6 | Grain read as dirty speckle at 0.5 opacity | Reduced to 0.2; re-inspected |
| V7 | Samosa label arrow touched the right edge in the mobile menu | Fixed (smaller type on that item); not re-screenshotted after the fix |
| V8 | Steam rendered as grey round smudges | Softened/enlarged falloff; reads as haze at rest. Needs a motion review on a real device |

Inspected and judged to work: hero composition (three words in three faces, atmosphere linked to word hover), three segment identities (distinct geometry/colour/type/transition), navigation (desktop + mobile menu), footer signature (neon wordmark + three logos).

## 3. Accessibility, behaviour and responsive checks (final build)

| Check | Result |
|---|---|
| axe-core, desktop 1440 and mobile 390 | **0 violations**. Found and fixed earlier: serious `color-contrast` (3.13:1 / 2.26:1) on Samosa copy sitting over the coral field — the coral field now belongs to the art column only |
| Reduced motion (`prefers-reduced-motion: reduce`) | 0 hidden elements, 0 running animations, **GSAP never requested** |
| JavaScript disabled | h1 + all section headings present; 0 hidden elements |
| After full scroll with motion on | 0 elements stuck hidden by GSAP |
| Mobile menu | 48×48 px target; opens; Esc closes; focus returns to the toggle; item link navigates to `#the-food` and closes the menu |
| Keyboard | First Tab = "Skip to content"; then logo → Biryani → Samosa → Thali → The Food → Visit → hero words; focus ring visible (3 px bone) |
| Internal links | 8 unique hrefs; 0 broken (all `/#…` anchors exist) |
| Responsive overflow, 7 widths | 0 horizontal overflow, 0 clipped visible text, 0 console errors/warnings |
| Touch/hover | Hover effects are CSS-only and also fire on `:focus-visible` |
Not covered: screen-reader (NVDA/VoiceOver) pass, WCAG 2.2 manual criteria (target size under all states, focus-not-obscured while the fixed header is shown), Safari/Firefox.

## 4. Crawlability and metadata (post-optimisation)

Verified on the final build: one `h1` ("TRISTAR Jharsuguda: Biryani Samosa Thali" — the "TRISTAR Jharsuguda:" prefix is `sr-only`); `<html lang="en-IN">`; title "TRISTAR Jharsuguda | Biryani, Samosa & Thali"; description present; canonical `https://tristar1947.com/`; `robots: index, follow`; OG title/description/image/url; sitemap lists `/` only; `robots.txt` allows all and points to the sitemap; JSON-LD `Restaurant` + `WebSite` with only verified fields; 0 images without alt. All food and location copy is real HTML (no JS needed). **Known nit:** the Samosa `h2` text content reads "Samosa in JharsugudaSamosa" (sr-only text + aria-hidden split letters); the accessible name is correct, but the DOM text has the word twice.

## 5. Mobile LCP investigation

**Conditions (identical for every figure):** production build, Lighthouse 12 default mobile profile (Moto G Power emulation, simulated Slow 4G 150 ms/1.6 Mbps, 4× CPU), fresh headless Chrome per run, one process at a time (an earlier parallel attempt was killed for memory pressure; its numbers are discarded).

**Final repeated runs (direct to `next start`, 5 runs):**

| Run | Perf | LCP | FCP | TBT | CLS |
|---|---|---|---|---|---|
| 1 | 79 | 2.98 s | 1.30 s | 501 ms | 0 |
| 2 | 67 | 3.49 s | 1.22 s | 950 ms | 0 |
| 3 | 83 | 2.93 s | 1.22 s | 415 ms | 0 |
| 4 | 85 | 2.92 s | 1.22 s | 382 ms | 0 |
| 5 | 78 | 3.11 s | 1.30 s | 499 ms | 0 |
| **Median / range** | 79 / 67–85 | **2.98 s / 2.92–3.49 s** | 1.22 s / 1.22–1.30 s | 499 ms / 382–950 ms | 0 |

LCP element: the text "BIRYANI" (no image). Page weight 271 KB. Earlier sets on earlier code: 3.05–3.34 s (first build of this direction), 2.88–3.15 s (after font/neon/steam changes), 2.95–3.26 s (after grain/shadow changes). The previous Odia build measured 3.8–4.2 s. **So LCP improved by ~1 s versus the old direction but is flat across this session's optimisations.** I do not call it a regression versus the old build; it is a miss against the 2.5 s goal.

**Controlled single-variable experiments** (CSS injected into the HTML by a local proxy that gzips responses; 3 runs each, sequential). The proxy inflates the baseline (3.8 s vs 3.0 s direct), so compare **within** this table only:

| Variant (one thing disabled) | LCP runs (s) | Median |
|---|---|---|
| base | 4.13, 3.76, 3.79 (earlier set: 3.86, 5.63, 4.68) | 3.79 |
| grain | 3.60, 3.55, 3.69 | 3.60 (−0.19) |
| text-shadow | 3.73, 3.77, 3.76 | 3.76 (−0.03) |
| neon glow (blur filter) | 4.01, 5.36, 4.09 | 4.09 (noise) |
| steam layers | 4.18, 5.24, 3.66 | 4.18 (noise) |
| slash + ring + heat glow | 3.65, 3.61, 3.97 | 3.65 (−0.14) |
| all atmosphere layers | 3.65, 3.70, 3.69 | 3.69 (−0.10) |
| neon sign + atmosphere + grain + text-shadow (everything decorative) | 3.83, 3.84, 3.63 | 3.83 (≈ 0) |
| all below-the-fold sections | 3.79, 3.51, 3.54 | 3.54 (−0.25) |

Other probes: in the real Lighthouse trace, the first paint (= LCP, a single candidate) lands at ~3.7–3.9 s while document/CSS/fonts finish by ~0.7 s and the page's main thread does only ~0.9 s of work; the GPU process shows ~3.9 s of busy `GPUTask`s (400–930 ms each) before first paint. A trivial text page in the same setup scores LCP 0.76–0.81 s, so the environment itself is not the floor. Re-running with `--disable-gpu` did **not** help (LCP 3.00, 3.45, 3.88 vs 3.33, 3.20, 3.15 default), so the "software GPU" explanation is **not confirmed**. Two further isolation variants (system fonts only; hero-text-only) and a `content-visibility` variant made Lighthouse hang or fail and produced no data; a no-JS variant hung as well.

**Conclusions (what the evidence supports):**
1. No single signature effect (grain, shadows, glow filter, steam, slash/ring/heat) is the dominant cause; removing *all* decorative effects together changed LCP by ≈ 0 within noise. They were **kept**, as required.
2. Below-the-fold content accounts for ≈ 0.25 s at most.
3. The cause is therefore somewhere in the shared first-paint path (candidates: GPU/raster cost of the full-viewport hero compositing at DSF 1.75, the three large display-face glyph runs, React/Next hydration timing) — **not isolated**. Run-to-run variance on this machine is high (e.g. 3.49 s in one final run, outliers up to 5.6 s under memory pressure).
4. Real-device and CDN behaviour are unknown; lab numbers may over- or under-state them.

**Suggested next steps (not done, need your go-ahead):** measure on a Vercel *preview* and on a physical mid-range Android (WebPageTest / PSI), then bisect by *removing the hero's full-viewport stacking context and three-face headline* in a branch; consider shipping a static first-frame poster approach only if real-device data confirms the miss.

## 6. Optimisations applied this session (design preserved)

Parent font de-preloaded and opsz axis dropped (75 → 41 KB, not preloaded); neon glow changed from a filter on animated strokes to a static blurred copy + crisp animated copy; steam/ring loops paused until `load` + idle; SVG-filter grain → 2 KB pre-rendered tile; large box-shadows on slash/ring removed (borders kept); steam layers reduced on mobile; Samosa coral field moved out from under body copy (also fixed contrast). Signature elements retained: neon ignition, steam, slash/ring atmosphere, three-face hero headline, per-world transitions.

## 7. Known defects and limitations

| # | Item | Severity |
|---|---|---|
| D1 | Mobile LCP 2.98 s median (goal ≤ 2.5 s); TBT up to 950 ms; mobile perf score 67–85 | **High (blocks "APPROVED")** |
| D2 | Dominant LCP cause not identified; no real-device data | High |
| D3 | Photography absent: food/premises slots are labelled placeholders; world illustrations are vector art, not food photos | Expected (client media) |
| D4 | Logos/palette/type are concepts; raster icon/OG derived from the concept mark | Needs approval |
| D5 | Samosa `h2` DOM text duplicates the word (sr-only + split letters) | Low |
| D6 | Scroll-scrubbed transitions (curtain, diagonal wipe, iris, kinetic slide) and hover states verified only by "ends in the correct visible state"; not visually reviewed mid-motion, not tested in Safari/Firefox/real touch devices | Medium |
| D7 | Hero atmosphere uses `:has()` for word↔atmosphere links; older browsers simply lose that hover link | Low |
| D8 | `npm audit` advisory in the ESLint toolchain (dev-only), unchanged | Low |
| D9 | Mobile-menu fix V7 not re-screenshotted | Low |
| D10 | INP not measured | Medium |

## 8. Unverified assumptions

- That the opening offer is exactly: chicken biryani, mutton samosa, vegetable samosa, thali (taken from the brief); thali contents unknown and never named.
- That "Kali Mandir Road, Jharsuguda, Odisha, India" is the complete public address (no PIN code, house number, map listing yet).
- Keyword intent (no search-volume data used or claimed).
- That Lighthouse lab LCP reflects field performance.
- That the supplied "1947" logo should no longer be public-facing (owner decision).
- Font licences (all OFL) and logo clearance/trademark were not checked.

## 9. Outstanding client approvals (the homepage is **not** self-approved)

1. Creative direction (neon/cinematic, three-world structure, kinetic type) — approve / amend.
2. Parent TRISTAR wordmark + mark (incl. the three-bar A crossbar); trademark search.
3. Three segment logo concepts and palettes; **final brand names** for Biryani / Samosa / Thali (currently provisional category names).
4. Removal of the wordmark logo from the Samosa panel (V2) and the duplicate-heading approach.
5. Role of the 1947 logo (retire / heritage line / separate sub-brand) and what "1947" means.
6. Photography/video plan and shoot approval (docs/05); thali varieties and contents; menu/prices public or not.
7. Full verified address, PIN, hours, opening date, phone, social links (for schema/Google Business Profile).
8. Whether to accept the current mobile LCP for a preview, or authorise the further investigation in §5.
9. Preview deployment (not performed) and, later, production/DNS.

## 10. Classification rationale

- **Not APPROVED:** a stated acceptance target (mobile LCP ≤ 2.5 s) is missed with repeatable evidence (5/5 runs ≥ 2.92 s), the cause is not isolated, and the creative direction has not been reviewed by the client.
- **Not BLOCKED:** the page is complete, accessible (axe 0, Lighthouse a11y/BP/SEO 100), crawlable, responsive, free of console errors and shippable as a preview; the miss is a performance gap, not a functional or content defect.
- **PARTIAL:** functional/accessibility/SEO checks pass; mobile performance target and client approvals outstanding.

I stopped here: no further pages built, nothing committed, deployed or modified in production.
