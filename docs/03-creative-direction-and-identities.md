# 03 · Creative direction, parent identity and three segment identities

> **Status: concepts for owner review. None of these logos, names, palettes or typefaces are approved.**
> "Biryani", "Samosa" and "Thali" are *provisional working identities* (category names), not final consumer-facing brand names.
> Source of all logo geometry: `scripts/make-logos.py` → `public/brand/*.svg` + `src/components/brand/paths.ts`. Visual sheet: `docs/assets/logo-sheet.png`.

## 1. One idea

**Three worlds, one door.** TRISTAR is a single address with three food worlds. The parent is the *threshold*: warm black, bone type, and a neon sign. Each world is a different *physics*:

| | Biryani | Samosa | Thali |
|---|---|---|---|
| Force | Heat rising | Impact / snap | Orbit / abundance |
| Geometry | Dome, arc, vertical rise | Triangle, diagonal, hard angle | Circle, ring, radial repetition |
| Tempo | Slow, heavy, 6–9 s loops | Snapped, stepped, 0.2–0.5 s | Smooth, orbital, 140–200 s drift |
| Mood | Charcoal / molten | Near-black / electric | Forest / lime / bronze |

The worlds relate through shared *rules* (warm-black ground, bone text, one neon per world, big type cropped by the frame, nothing decorative that does not describe food) but share no layout, shape language or motion.

## 2. Parent identity — TRISTAR (concept)

- **Wordmark** (`public/brand/tristar-wordmark.svg`): hand-constructed monoline capitals, no font. Squared T/R/I, one round S, and an **A whose crossbar is three bars — ember, coral, lime**: the three worlds as one bar. Reads as a neon tube; gaps around the A are optically tightened.
- **Mark** (`tristar-mark.svg`): three right-angled blades rotated 120° around a shared point (a pinwheel "tri-star"), one blade per world colour. Works at 16 px (favicon) and as a large graphic.
- **Lockup** (`tristar-lockup.svg`): mark + wordmark; used in the header.
- **Digital behaviour:** the hero wordmark is a neon sign that ignites letter by letter (1.7 s, CSS only, never the LCP element).
- **Palette:** Ink `#0A0806` · Ink-2 `#14100D` · Bone `#F3EDE2`, plus each world's neon. Bone-dim text `rgba(243,237,226,.74)` on ink ≈ 9:1.
- **Type:** Bricolage Grotesque (variable, parent UI/body/section heads) — contemporary, slightly eccentric grotesque with editorial tension; tight tracking at display sizes.
- **Needs approval:** final wordmark construction (A treatment), whether the mark ships alongside it, and trademark/clearance search (not performed).

## 3. Segment identities (concepts)

### BIRYANI — Heat / Aroma / Fire
- **Logo** (`biryani-logo.svg`): lifted-lid *handi* emblem with three steam strokes above an outlined **Rozha One** wordmark. Lid is tilted so the opening — the moment steam escapes — is the logo's story.
- **Colour:** Ember `#FF6A1F`, Copper `#C26A2E`, Gold `#FFB938`, Charcoal `#110C09`.
- **Type:** Rozha One — an ultra-heavy, high-contrast display serif with Indian-script heritage; confident, not ceremonial.
- **Motifs:** pot, lid, steam wisps (stroke-dash loops), expanding heat rings, ghost wordmark cropped by the panel's lower edge, a low flat "burner" glow.
- **Motion:** slow curtain rising from below (clip-path inset, scrubbed), copy drifts up, 6–9 s steam loops.
- **Photography direction:** macro rice and grain, pot opening in backlight with real steam, deep warm shadows, copper/brass props; low-key, single hard source. (Shot list B1–B6.)

### SAMOSA — Crunch / Energy / Impact
- **Logo** (`samosa-logo.svg`): **Syne ExtraBold** outlined, skewed −10°, with a coral samosa-triangle sitting in the O's counter, a zig-zag "bite" crack, and a hot-pink underline.
- **Colour:** Electric Coral `#FF4B5C`, Neon Pink `#FF2D95`, Fried Gold `#F2B544`, Near-black `#0D0A0C`.
- **Type:** Syne 800 — wide, experimental, gallery-poster energy.
- **Motifs:** triangles (whole and bitten), hatch "crisp" texture, flying crumbs, hard diagonal cuts.
- **Motion:** diagonal wipe on a 5-step ease (no smoothing), letters knock in with ±9° rotation on `back.out`, hover = hard offset snaps.
- **Photography direction:** hard flash-like light, broken pastry mid-air, mutton and vegetable fillings shown side by side, saturated backgrounds in coral/pink, tight crops. (Shot list S1–S6.)

### THALI — Feast / Abundance / Comfort
- **Logo** (`thali-logo.svg`): overhead plate — bronze rim, forest plate, **six katori** around a lime centre — over an outlined **Instrument Serif Italic** wordmark.
- **Colour:** Electric Lime `#C8FF3A`, Forest `#0F3B26` (`#07140D` ground), Bronze `#B4773A`.
- **Type:** Instrument Serif Italic — tall, sophisticated, rhythmic; the only italic in the system, so Thali is instantly distinguishable.
- **Motifs:** concentric rings, radial bowl arrangement, a ring of 48 rhythmic dots, hairline bronze orbits.
- **Motion:** iris opens from the plate centre (circle clip-path), plate settles with a long `expo.out` rotation, dots/bowls counter-rotate at 140/200 s.
- **Photography direction:** true overhead, circular compositions, every bowl legible, warm window light, bronze and green linen, generous negative space. (Shot list T1–T6.)
- **Facts policy:** bowls are deliberately unlabelled; thali contents/varieties are **not confirmed** and are not named anywhere.

## 4. Role of the supplied 1947 logo — explicit review

The ivory "1947 — The Odia Diner" medallion is **preserved byte-for-byte** (`brand-source/1947-logo-original.png`, `public/brand/1947-logo.png`) and is **no longer used anywhere in the UI, metadata or structured data**. Options for the owner:

1. **Retire from public use** (recommended if "Odia Diner" is no longer the concept; keep as an archive asset).
2. **Heritage sub-line** ("Since/Est. 1947") — only if the owner confirms what 1947 refers to. The meaning of "1947" was never supplied and is not guessed.
3. **Separate sub-brand** — keep the medallion as its own mark for a different offering.
The domain `tristar1947.com` is unaffected by this decision.

## 5. Typography system (and why it is four faces)

| Role | Face | Weight/style loaded | Preloaded |
|---|---|---|---|
| Parent / UI / body | Bricolage Grotesque | variable (wght), latin | **no** (fallback is size-adjusted) |
| Biryani | Rozha One | 400 | yes (LCP word) |
| Samosa | Syne | 800 | yes (hero word) |
| Thali | Instrument Serif | 400 italic | yes (hero word) |

All OFL, self-hosted by `next/font`. The three display faces differ in genre (heavy serif / wide grotesque / italic text serif) so the worlds are distinguishable even in greyscale.

## 6. Motion system

Principles: motion explains a food idea; scroll is never hijacked or pinned; everything is transform/opacity/clip-path; content is complete HTML before any script runs.

| Layer | Trigger | Tech |
|---|---|---|
| Neon ignition, steam, ring, wisps, heat rings | load (ambient loops start after load + idle) | CSS keyframes |
| Hover/focus: word ↔ atmosphere link in hero (`:has`), nav underline, button fill bar | pointer/keyboard | CSS |
| World transitions (curtain / diagonal wipe / iris), letter knock-in, kinetic words | scroll (scrubbed) | GSAP + ScrollTrigger, loaded on first interaction |
| Reduced motion | `prefers-reduced-motion` | all animation off; static atmospheric frames; nothing hidden |
| Mobile | ≤ 40 em | fewer steam layers, larger words, full-width CTAs |

## 7. Art direction / moodboard (text brief)

- **Light:** one hard source per world; neon is *emission*, not gradient wash. Edges lit, faces in shadow.
- **Texture:** static film grain (one tiled SVG), steam wisps, brushed copper, crisp hatch, linen.
- **Composition:** oversize type cropped by the frame, diagonal tension (Samosa), radial symmetry (Thali), vertical rise (Biryani).
- **Colour discipline:** max one neon per screen section; bone for reading text.
- **Anti-goals honoured:** no glass cards, no orbs, no default gradient backgrounds, no three-column feature grid, no recoloured clones.
- **Visual references in repo:** `docs/assets/logo-sheet.png`, `qa/shots/*.png` (current homepage in every scene).
