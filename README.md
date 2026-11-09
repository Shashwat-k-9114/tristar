# TriStar 1947

Next.js (App Router, TypeScript) site for Utkal Biryani House, The Kalinga Kitchen and Chilika Banquet.

    npm install
    npm run dev          # http://localhost:3000
    npm run build && npm start

- Menu data: `lib/menu.ts` (IDs are saved-cart keys — don't reorder). Contact/WhatsApp/opening dates: `lib/site.ts`.
- Dish photos: see `public/img/dishes/README.txt`.
- Set `NEXT_PUBLIC_SITE_URL` (e.g. https://yourdomain.com) in production for correct social-share URLs.
- Reservations, enquiries and orders are stored in the visitor's browser (staff inbox in the footer) and confirmed via WhatsApp, as before.

## Repository layout note

`app/`, `components/`, `lib/` and `public/img/` are the live site. `src/`, `docs/`, `qa/`, `latest-run/` and `public/brand|og.png|grain.png` come from an earlier, separate design exploration that was merged into this repo; they are excluded from the build and lint. The original `package.json`/config of that exploration is in git history (commit fb269df).
