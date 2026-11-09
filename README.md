# TriStar 1947

Next.js (App Router, TypeScript) site for Utkal Biryani House, The Kalinga Kitchen and Chilika Banquet.

    npm install
    npm run dev          # http://localhost:3000
    npm run build && npm start

- Menu data: `lib/menu.ts` (IDs are saved-cart keys — don't reorder). Contact/WhatsApp/opening dates: `lib/site.ts`.
- Dish photos: see `public/img/dishes/README.txt`.
- Set `NEXT_PUBLIC_SITE_URL` (e.g. https://yourdomain.com) in production for correct social-share URLs.
## Google Sheets backend

Every order, table reservation and banquet enquiry is validated on the server (`/api/submit`) and written to the Google Sheet
as a new row, in three tabs (created automatically): **Orders**, **Reservations**, **Banquet Enquiries**.
Prices are always recalculated server-side from `lib/menu.ts`. Staff manage everything at **`/admin`** (password protected),
which reads and updates the same sheet (status + notes columns).

### One-time setup — Option A: Apps Script (free, no card, recommended)
1. Open the Google Sheet → **Extensions → Apps Script**. Delete the sample code and paste in `scripts/apps-script/Code.gs`.
2. Replace `PASTE_A_LONG_RANDOM_STRING_HERE` with a long random string (e.g. from `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`). Save.
3. **Deploy → New deployment → ⚙ Select type: Web app** → *Execute as:* **Me**, *Who has access:* **Anyone** → Deploy → authorize when prompted
   (Advanced → "Go to project (unsafe)" is normal for your own script) → copy the **Web app URL**.
4. Set environment variables in Vercel (Project → Settings → Environment Variables) or `.env.local`:
   - `APPS_SCRIPT_URL` — the Web app URL
   - `APPS_SCRIPT_SECRET` — the same string as in step 2
   - `ADMIN_PASSWORD` — staff login password
   - `SESSION_SECRET` — random 32+ char string
   - `NEXT_PUBLIC_SITE_URL` — your live domain
5. Redeploy, open `/admin`, sign in, submit a test form on the site and confirm the row appears.

If you later change `Code.gs`, use **Deploy → Manage deployments → Edit → New version** (the URL stays the same).

### Email notifications
Every order, reservation and banquet enquiry sends a branded email to the guest (if they gave an address) and to your staff.
- Emails go out through the Apps Script, from the Google account that owns it. After updating `Code.gs`, deploy a **New version** and approve the new "send email" permission when asked.
- Set staff recipients in **/admin → Settings** (stored in the sheet's `Settings` tab). `ADMIN_EMAILS` (comma-separated) is only a first-run default.
- Set `NEXT_PUBLIC_SITE_URL` to your public domain, otherwise images in emails won't load.
- Gmail limits sending to about 100 emails/day on a free account (1,500 on Workspace).
- Preview every template in **/admin → Settings → Preview the emails**. With `LOCAL_STORE=1`, emails are written to `.data/outbox` instead of being sent.

### Option B: Google Cloud service account
Needs a Cloud project (Google may ask for billing details even though the Sheets API is free). Enable the Sheets API,
create a service account + JSON key, share the sheet with its `client_email` as Editor, then set `GOOGLE_SHEET_ID`,
`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (keep the `
` escapes) plus the admin/site variables above.

Keep the **Status** and **Notes** columns last in each tab and don't rename the header row; you can freely add your own
sheet tabs, filters, charts or formulas on other tabs. Local development without Google: set `LOCAL_STORE=1` in `.env.local`
(data goes to `.data/store.json`; disabled in production).

## Repository layout note

`app/`, `components/`, `lib/` and `public/img/` are the live site. `src/`, `docs/`, `qa/`, `latest-run/` and `public/brand|og.png|grain.png` come from an earlier, separate design exploration that was merged into this repo; they are excluded from the build and lint. The original `package.json`/config of that exploration is in git history (commit fb269df).
