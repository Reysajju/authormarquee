# AuthorMarquee — “Your name, in lights.”

> **MOBILE APP FIRST — this is an Android app, not a website.**
> The real product lives in the AuthorMarquee Android app (Capacitor, appId `com.authormarquee.app`).
> The domain **authormarquee.com is ONLY a landing page**: marketing, features, how it works, genre showcase, FAQ, a Google Play download placeholder, a claim-preview link, and the delete-account link. It does not host the app screens.
> **In this demo repo, the landing page is `/` and the app lives under `/app` (Home), `/app/discover` (Discover), `/dashboard`, `/book` (Slots), `/badge`, and `/settings` (Profile) — wrapped in a phone app shell with bottom navigation, exactly as it will feel on Android.**
> **Final app name: AuthorMarquee** (confirmed by user).
> **Planned URLs — NOT live yet:** `authormarquee.com/claim/<slug>` and `authormarquee.com/delete-account`.
> The domain itself is **not yet bought/confirmed**, so those URLs are planned, not live. Do not publish or register anything until the domain is confirmed.
> Brand rename points (for future renames only): `package.json` → `name`, `capacitor.config.ts` → `appId` + `appName`, `lib/brand.ts` → `APP_NAME`.

**What changed in v2 (dynamic, app-first):** landing page (`/`) is separate from the app; the app shell has a sticky marquee-bulb header and bottom nav (Home, Discover, Dashboard, Slots, Profile); live ticking countdowns (midnight draw, finalist 24h offer, Friday draw on Claim); live-ticking dashboard counters; upvotes persisted in localStorage with animation; genre tabs + search + sort + claim filter on Discover; per-genre leaderboards and a trending strip; an FCM-style notifications feed; an interactive slot calendar with live dynamic pricing; rich book details (pages, year, price, author bio, long blurb, reader reviews, 7-day SVG chart, similar books); Badge Studio with 3 templates; and a premium dark + gold marquee theme. All client-side, mock data, no real keys.

**Unchanged:** Supabase 5-table schema, midnight draw (1 free winner + 10 finalists per genre), dynamic pricing `min($100, $10 + poolSize×$0.25 + bookedSlots×$8)`, Personal Play Console closed-testing plan (12 testers / 14 days), and the policy rule that the free draw is **100% FREE** — paid purchases are **ONLY “Guaranteed Sponsored Placement / Ad Slot Booking”** and never increase draw odds.

## What this build is / is not

- ✅ Runnable Next.js (App Router) + Tailwind demo with mock data. Runs with **no keys at all**.
- ✅ Supabase schema, midnight-draw logic, scraper skeleton, payments routing notes, Play checklist.
- ❌ NOT published to Google Play. ❌ No real payments. ❌ No real secrets. ❌ No live Amazon scraping.
- ❌ Supabase does **not** exist yet — see “Supabase from scratch” below. Until it is created, the app stays in mock mode.

## Run it (mock mode, no keys needed)

```bash
# On this Linux workspace:
cd ~/workspace/author-spotlight-app
npm install
npm run dev
# open http://localhost:3000
```

Windows (the user's PC — the Linux path above does NOT exist on Windows):
```
REM 1. Download the AuthorMarquee.zip the parent agent sends, right-click > Extract All
REM 2. Extract into D:\AuthorMarquee so that package.json sits directly in D:\AuthorMarquee
REM    (not in D:\AuthorMarquee\AuthorMarquee). Check with: dir D:\AuthorMarquee\package.json
REM 3. Then, in cmd:
cd /d D:\AuthorMarquee
npm install
npm run dev
REM 4. Open http://localhost:3000 in the browser. Landing page = /, app demo = /app
```
If `npm install` says ENOENT / cannot read package.json, you are in the wrong folder — the zip was not extracted into that folder, or it extracted into a nested subfolder. Fix the folder first; do not re-run npm in the empty folder.

Production-style check:

```bash
npm run build
npm start
```

Routes — landing vs app (do not mix them up):

| Route | What it is |
| --- | --- |
| `/` | LANDING PAGE ONLY (authormarquee.com): hero, features, how it works, genre showcase, FAQ, Play download placeholder, claim preview, delete-account link |
| `/app` | APP HOME (billboard): #1 Hero, #2/#3 Spotlight, Today's Free Winner, trending strip, genre pool, leaderboard, notifications — inside the phone app shell |
| `/app/discover` | APP DISCOVER tab: search by title/author, genre tabs, sort (upvotes/rating/newest), claimed/unclaimed filter, leaderboard, trending |
| `/book-detail/[id]` | APP book detail (linked from every card): pages/year/price, author bio, long blurb, reader reviews, 7-day chart, similar books, Claim + Book a slot |
| `/claim/[slug]` | CLAIM PREVIEW (landing-linked): gold frame, book facts, what-happens-next steps, countdown to Friday's free draw (demo: `/claim/b000000003`, planned live URL: `authormarquee.com/claim/b000000003`) |
| `/dashboard` | APP DASHBOARD tab: live counters, 7-day chart, rank progress, credits wallet, active slots, notifications, push toggle |
| `/book` | APP SLOTS tab: interactive 21-day calendar, open vs taken, live dynamic price per day, 24h Finalist countdown, 48h 50%-off extend |
| `/badge` | APP BADGE STUDIO tab: 3 templates (Gold Marquee, Dark Spotlight, Minimal Crown), book/genre pickers, live Canvas preview, download + native Share Sheet placeholder |
| `/settings` | APP PROFILE tab: Settings + “Delete My Account & Data” button (Play requirement) |
| `/delete-account` | PUBLIC account-deletion page (Play Console → App Content → Account Deletion; planned live URL: `authormarquee.com/delete-account` — domain not yet bought, so not live) |

The “Defend Your Crown” banner (only when featured, 48h at 50% off) is a component used on `/app` and `/dashboard`:
`components/DefendCrownBanner.tsx`.

10 seeded genres (mock books, picsum placeholder covers — not Amazon images):
Romance, Thriller & Mystery, Sci-Fi & Fantasy, Non-Fiction & Self-Help, Horror, Historical, YA, Business, Poetry, Memoir.

## Supabase from scratch (do this only when ready to leave mock mode)

Supabase does **not** exist yet. Nothing in this repo creates it automatically. Steps:

1. Go to https://supabase.com/dashboard → **New project**. Pick a name, a database password (store it safely, never in this repo), and the closest region.
2. Wait for provisioning, then open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy `.env.example` to `.env.local` and paste those two values (keep placeholders for Stripe/FCM/RevenueCat until those accounts exist).
4. In Supabase, open **SQL Editor → New query**, paste `supabase/schema.sql`, run it. This creates exactly the 5 tables:
   `authors`, `books`, `pool_entries`, `sponsored_slots`, `analytics_events` (+ indexes, `claim_slug` on books for `/claim/[slug]`).
5. (Optional demo seed) Adapt `supabase/seed.sql` with your real, licensed book list. Do **not** bulk-import scraped Amazon data — see `lib/scraper.ts`.
6. Enable pg_cron for the midnight draw: **Database → Extensions → enable `pg_cron`**, then schedule the job in `supabase/midnight-draw.sql` at **00:00 UTC** daily. Until pg_cron is enabled, `lib/draw.ts` (`runGenreDraw`) reproduces the same logic in TypeScript for testing.
7. Restart the dev server. `lib/supabase.ts` returns a real client only when the URL/key are non-placeholder; otherwise the app keeps using mock data — that fallback is intentional, so a missing Supabase project never breaks the demo.
8. Before production, tighten the permissive demo RLS policies in `schema.sql` (authors should only see their own rows).

## Tech stack (as specified)

| Layer | Choice |
| --- | --- |
| Web + Mobile UI | Next.js (App Router) + Tailwind CSS + Capacitor.js (React Native / Expo is the alternative, not both) |
| Database & Cron | Supabase (PostgreSQL + `pg_cron` + Edge Functions when live) |
| Book data | `lib/scraper.ts` skeleton — mock now; production must use Google Books API / a licensed source, NOT Amazon scraping (see TODO in that file) |
| Badge generator | HTML5 Canvas (in `/badge`); `@vercel/og` (Satori) is the server-side alternative |
| Push & Email | Firebase Cloud Messaging (FCM) + Brevo / Smartlead / Maileroo (placeholders only) |
| Payments (dual) | See `lib/payments.ts` |

## Payments — dual billing (no real keys, no checkout calls)

- **In-app Android:** Google Play Billing via RevenueCat for “Ad Slot Credits” ($9.99 / $24.99 / $49.99 / $99.99 packs). Buys guaranteed placement only.
- **Web & email (0% Google tax):** Stripe / DodoPay web checkout links sent by email (“Near-Miss Finalist Offer”, “Defend Your Crown”). Google Play permits emailing users outside the app with web checkout links. When paid on the web, Supabase updates `sponsored_slots` and the app reflects it.
- **Never** let authors pay to increase draw odds — Google Play classifies paid odds boosts as gambling. Keep the draw free, boosted only by free social sharing/upvotes.

See `lib/payments.ts` (`routeCheckout`, `CREDIT_PACKS`, `PAYMENT_POLICY_NOTE`).

## Midnight draw + dynamic pricing

Implemented in `lib/draw.ts`, SQL concept in `supabase/midnight-draw.sql`:

- Per genre: **1 weighted free winner** (weight = 1 + upvote_count, free sharing only) + **10 shortlisted finalists** (highest upvotes among the rest) with a 24h discount countdown (`discount_offer_expires_at`).
- **Dynamic slot price:** `min($100, $10 + poolSize × $0.25 + bookedSlots × $8)` — e.g. Thriller pool 162, 2 booked → min(100, 10 + 40.50 + 16) = $66.50.

## Android / Capacitor → .aab (when ready, do NOT publish yet)

```bash
npm run build
npx cap add android
npx cap sync
# Open in Android Studio, or build a signed bundle:
#   cd android && ./gradlew bundleRelease
# The signed .aab goes to Play Console → Closed Testing (see PLAYSTORE_CHECKLIST.md).
```

Notes:
- `capacitor.config.ts` currently has no `server.url`. For a server-rendered Next.js app, deploy the web portal first and point `server.url` at it, OR switch Next.js to static export (`output: 'export'`) once every route is static-safe.
- Required native pieces (already stubbed in code, not yet wired to real SDKs): `@capacitor/push-notifications` (FCM), `@capacitor/share` + `@capacitor/filesystem` (badge download/share), in-app account deletion (`/settings` → `/delete-account`).
- **Play Console account here is PERSONAL** — so the 12-tester / 14-day Closed Testing gate applies. See `PLAYSTORE_CHECKLIST.md`. Do not assume the Organization-account bypass.

## Environment variables

Copy `.env.example` → `.env.local`. All values are placeholders in this repo:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ service-role, server-only, never exposed)
- `STRIPE_*` / `DODOPAY_API_KEY` (web checkout, later)
- `NEXT_PUBLIC_FCM_SENDER_ID` / `FCM_SERVER_KEY` (push, later)
- `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY` (Play Billing wrapper, later)

## 3 inputs still needed from the user

1. **Domain confirmation/purchase for authormarquee.com** — name is confirmed, domain is not yet bought/confirmed; planned URLs above are not live until then.
2. **Supabase project keys** — after creating the project from scratch per the steps above (URL + anon key).
3. **Stripe / FCM / RevenueCat keys** — only when ready to wire real payments/push; the demo deliberately runs without them.
"# authormarquee" 
