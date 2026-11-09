# 1947 – The Odia Diner · Milestone 1 & 2 record

Domain: https://tristar1947.com (not deployed; no DNS touched). Status: **Opening soon**.

## 1. Creative direction — "A Culinary Ode to Odisha"
- **Concept.** Dusk-to-dawn: a cocoa night sky, saffron sun, and a skyline of Kalinga temple towers. The supplied emblem is presented as an ivory medallion (the logo has an ivory background, so it is seated on a circular ivory disc rather than altered).
- **Palette (tokens in `globals.css`).** Terracotta `#A83E24`, Ivory `#F8F2E6`, Cocoa `#28160F`, Olive `#68733C`, Saffron `#E5A44E`. Added `olive-deep #4C5628` for AA-safe text/backgrounds, and `terracotta-deep`, `saffron-soft`.
- **Type.** Cormorant Garamond (display), Manrope (UI/body), Noto Sans Oriya (Odia), all via `next/font` (self-hosted at build). Fluid scale: `.t-display`, `.t-h2`, `.t-h3`, `.t-eyebrow`, `.t-lead`.
- **Art.** All artwork is original SVG (temple skyline, wheel motif, lotus, sun rays, jali, ikat bands) — inspired by general Odia traditions, not copied from any site or the logo's raster art.
- **Reference approach.** I did not copy any hospitality site. Direction is derived from the brand's own emblem and from verified Odia culture (see sources in section 5). A formal competitor/reference review is **not** done and is listed below.

## 2. Motion plan (implemented)
| Treatment | Where | Mechanism |
|---|---|---|
| Masked headline rise, fades, medallion/rays entrance | Act I | Pure CSS keyframes (never waits on JS; LCP-safe) |
| Masked rise, fade-lift, image wipe | Acts II–V | GSAP, only for off-screen elements |
| Depth parallax (sun, skyline) | Hero | GSAP ScrollTrigger scrub, transform only |
| Horizontal storytelling | Act II | Native scroll-snap (no hijacking, no pinning) |
| Hover lift / glyph shift | Dish cards | CSS, hover-capable devices only |
- GSAP loads **only on first user interaction**; skipped under `prefers-reduced-motion`; nothing is hidden beforehand, so failure/no-JS = complete static page.
- Not built (deliberately): custom cursor, page transitions, perpetual animation, pinned sections.

## 3. Asset inventory
| Asset | State |
|---|---|
| Logo `image.png` 1254×1254 RGB PNG, ivory background, no alpha | Preserved byte-for-byte (SHA-256 `fc41f333…53dee`) in `../brand-source/` and `public/brand/1947-logo.png`. Served resized via `next/image`; small `icon.png`/`apple-icon.png`/`og.png` are derived copies. |
| Vector/transparent logo | **Missing** — request SVG/AI from the designer. |
| Photography (food, interiors, team) | **None supplied.** No stock or generated imagery used. |
| Video | None |
| Fonts | Google Fonts OFL via next/font |

## 4. Unresolved business content (blocks full SEO/local SEO)
1. City and full street address, postal code, map link → needed for Restaurant/LocalBusiness schema, Visit page, Google Business Profile.
2. Opening date and hours.
3. Phone, email, WhatsApp, social profiles (nothing was invented; the owner's Gmail in this session was *not* used).
4. Real menu (dishes, descriptions; prices only if the owner wants them public).
5. Real photography of food and premises, with usage rights.
6. Meaning/origin of the name "1947", founder/team story — **not stated anywhere; not guessed.**
7. Confirmation of the cuisine style/region within Odisha, dietary offer (veg/non-veg), reservations policy.
8. Legal: registered business name, FSSAI number, privacy contact.
9. Account holders for Google Search Console and Bing Webmaster Tools.

## 5. Content sources & accuracy notes
Verified in-session: Pakhala Dibasa is a grassroots observance on 20 March (not an official state festival); Konark Sun Temple is a UNESCO site (1984, 13th c.); Odisha Rasagola GI granted 29 Jul 2019 (contested by West Bengal's own GI — **not claimed on the site**); Enduri pitha ↔ Prathamastami, poda pitha ↔ Raja. Chhena Poda's origin could **not** be verified and is deliberately not claimed. "Santula", "Pattachitra/Raghurajpur", "Sambalpuri ikat", "Chilika" descriptions are general, widely documented facts but were not individually source-checked — editorial review by an Odia food/culture expert is recommended before launch. Odia-script strings (ଓଡ଼ିଶାର ସ୍ୱାଦ, ସ୍ୱାଗତ, ପଖାଳ, ଦାଲମା, ସନ୍ତୁଲା, ମାଛ ବେସର, ଛେନା ପୋଡ଼, ପିଠା) need native-speaker proofreading.

## 6. Page publishing policy
Only `/` exists. Planned pages (Story, Explore Odisha, Menu, Dining, Gallery, Journal, Visit, Contact, Privacy) will ship in Milestone 3. Pages without real content (Menu, Gallery, Visit, Contact) will be `noindex` and excluded from the sitemap until the data above exists. Homepage CTAs currently scroll to on-page sections.

## 7. QA results so far (local production build, Playwright Chromium + Lighthouse 12)
- `tsc`, ESLint: clean. `next build`: success, all routes static.
- Playwright: 3 viewports (1440×900, 390×844, 360×780): 0 console errors, 0 horizontal overflow; reduced-motion: nothing hidden; JS disabled: full content; mobile menu (open, Escape, focus return, anchor nav, 48 px target); skip link first tab; reveals complete after scrolling.
- axe-core (WCAG 2.0/2.1/2.2 A/AA + best practice): 0 violations desktop & mobile. (Automated only; a manual screen-reader pass is still needed.)
- Lighthouse: Accessibility 100, Best Practices 100, SEO 100 (both). Desktop Performance 96–97, LCP 0.9 s, CLS 0, TBT 60–110 ms.
  **Mobile Performance 50–85 (high run-to-run variance on this machine), LCP ≈ 3.8–4.2 s under Lighthouse's simulated slow-4G/4× CPU → the LCP ≤ 2.5 s target is NOT yet met on that profile.** CLS 0.
- Not yet done: INP measurement, real-device iOS/Android, Firefox/WebKit, structured-data validator, broken-link crawl (only one page), preview deployment.

## 8. Performance backlog (Milestone 6)
- Subset the 97 KB Odia font to used glyphs (largest font; competes with LCP on slow networks).
- Trim JS (~140 KB gz Next/React baseline) — audit client components, check `reactCompiler`/bundle analyzer.
- Re-test on a Vercel preview with real CDN/HTTP2 and WebPageTest on a physical mid-range Android.
- Known tooling note: `npm audit` reports high-severity advisories in the ESLint toolchain (dev-only, `braces`); `--force` would downgrade Next, so deferred.
