# 07 · SEO foundation and keyword architecture (homepage checkpoint)

Full SEO/AEO/GEO implementation is Phase 6. This records what the homepage already does, the keyword map the next pages will follow, and what needs the owner.

## Keyword architecture (intent map — no search volumes claimed)

No keyword-volume/competition data tool was available in this session, so **nothing here asserts volume or difficulty**. Validate with Google Search Console (after launch), Google Keyword Planner and a SERP review of Jharsuguda results before committing copy.

| Page | Primary intent (genuine) | Secondary phrases used naturally in copy |
|---|---|---|
| `/` | Tristar Jharsuguda; restaurants in Jharsuguda | restaurant near Kali Mandir Road Jharsuguda; biryani, samosa and thali in Jharsuguda |
| `/biryani` (Phase 4) | biryani in Jharsuguda; chicken biryani Jharsuguda | chicken biryani near me (Jharsuguda) |
| `/samosa` (Phase 4) | samosa in Jharsuguda | mutton samosa Jharsuguda; veg samosa Jharsuguda |
| `/thali` (Phase 4) | thali in Jharsuguda | veg/non-veg thali only if confirmed |
| `/menu`, `/visit`, `/about`, `/gallery` | navigational/local | address, directions, hours (when verified) |

Rules: one primary intent per URL; unique title/description; segment pages link to each other and to `/visit`; no doorway pages; no "near me" stuffing; never claim ranking, awards or reviews.

## Implemented on the homepage

| Item | State |
|---|---|
| Static prerender, semantic landmarks (`header`, `nav`, `main`, `section`/`article` with `aria-labelledby`, `footer`), one `h1`, logical `h2`s | ✅ |
| All food/location text is real HTML (nothing inside video, canvas or images) | ✅ |
| Unique `<title>` "TRISTAR Jharsuguda \| Biryani, Samosa & Thali"; original meta description | ✅ |
| Canonical, Open Graph, Twitter card (`og.png` 1200×630) | ✅ |
| `robots.txt`, `sitemap.xml` (only existing indexable URLs) | ✅ |
| JSON-LD `Restaurant` + `WebSite` — **only verified fields**: name, URL, street "Kali Mandir Road", city Jharsuguda, region Odisha, country IN, cuisine, logo, image | ✅ (partial by design) |
| Crawlable navigation: real `<a href>` anchors | ✅ |
| Decorative SVGs `aria-hidden`; logos labelled | ✅ |

## Deliberately *not* emitted (not verified — do not invent)

`postalCode`, `telephone`, `geo`, `openingHoursSpecification`, `openingDate`, `priceRange`, `hasMenu`, `aggregateRating`, `sameAs`, map link. Expect Search Console's Rich Results Test to warn about missing recommended Restaurant fields until these exist.

## Owner actions required (cannot be done by the build)

1. Verify the full address incl. PIN code, and confirm the exact spelling used on the Google Business Profile (NAP consistency).
2. Create/claim Google Business Profile; supply phone, hours, opening date, categories (Restaurant / Biryani restaurant etc.), photos.
3. Add the site in Google Search Console (DNS or HTML-tag verification) and Bing Webmaster Tools; submit `https://tristar1947.com/sitemap.xml`.
4. Provide social profile URLs (for `sameAs`) and a public contact channel.
5. Decide whether to publish a menu/prices; confirm thali varieties.
6. IndexNow: add a key file once the production host is final (Phase 6).
7. Production deploy/DNS approval (no deployment has been performed).
