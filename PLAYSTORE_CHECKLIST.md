# Google Play Store Submission Checklist — AuthorMarquee

> Final app name: AuthorMarquee. Tagline: “Your name, in lights.”
> Planned domain `authormarquee.com` is NOT yet bought/confirmed — planned URLs below are not live.
> **Play Console account type here is PERSONAL (not Organization).**
> Therefore the 12-tester / 14-day Closed Testing gate APPLIES. The Organization-account / D-U-N-S bypass does NOT apply to this account and must not be relied on.

## 1. Closed Testing path (PERSONAL account — this is the required path)

Personal Google Play Console accounts created after Nov 2023 must run a **Closed Test with at least 12 real testers opted in continuously for 14 days** before Production access.

Checklist:

- [ ] Upload the signed `.aab` to the **Closed Testing track** (Internal Testing does **not** count toward the 14 days).
- [ ] Recruit **15–18 testers** (buffer above the 12 minimum, in case of dropouts) on real Android devices, and keep at least 12 opted in for the full 14 days.
- [ ] Push **1 minor version update on Day 7** and collect feedback via an in-app form.
- [ ] On **Day 15**, use that genuine feedback to answer Google's Production Access questionnaire.
- [ ] Only then request Production access / submit to Production.

Do NOT skip this by assuming an Organization account — this account is Personal.

## 2. Store listing configuration

| Play Console item | Exact configuration to select |
| --- | --- |
| App category | **Business** or **Books & Reference** (choose *Business* if framing as an Author Marketing & Ad Placement Portal) |
| Content rating (IARC) | Select **“No”** for Gambling, Simulated Gambling, and Contests/Sweepstakes — the free daily showcase is a free editorial/community selection and paid slots are fixed B2B ad placements, not a paid lottery |
| Data Safety | Declare collection of **Name, Email Address, User IDs, and App Activity/Analytics** — marked *Encrypted in transit* and *Users can request data deletion* |
| Account deletion URL | Planned public page at `https://authormarquee.com/delete-account` — **planned, not live: domain not yet bought/confirmed** (implemented in this repo as `/delete-account`) — link it in **Play Console → App Content → Account Deletion** only after the domain is live. Also keep the in-app button: Settings → “Delete My Account & Data” (`/settings`) |
| Reviewer login (App Access) | Pre-populated Demo Author Email & Password with 2 books claimed, live analytics numbers, and an active “Finalist Slot Offer”, so the reviewer can test every screen in 60 seconds. Demo in this repo: `demo-author@example.com` / `demo-password-placeholder` — **replace with a real seeded demo account before submission** |
| Minimum functionality | The app must do more than wrap a website: native push (FCM), native Share Sheet badge download, booking calendar, and dashboard are the native features — verify all work in the `.aab` before submitting |

## 3. Store listing visuals (prepare before Submit)

- [ ] **512×512 App Icon** (placeholder SVG in this repo: `public/icon.svg` — export a real 512×512 PNG before submission)
- [ ] **1024×500 Feature Graphic**
- [ ] **4–6 Phone Screenshots** showing: (1) Genre Front Page, (2) Live Click & Impression Analytics, (3) Instant Featured Author Badge Generator, (4) Slot Booking Calendar (+ 2 optional: Claim screen, Defend Your Crown banner)

## 4. Policy rules that must not be broken

- **No paid lotteries:** never let authors pay to increase odds in the random draw. Draw is 100% free (boosted only by free social sharing). Paid purchases are strictly “Guaranteed Sponsored Placement / Ad Slot Booking”.
- **Dual billing:** in-app purchases via Google Play Billing (RevenueCat); email/web checkout (Stripe/DodoPay) only via links sent outside the app — never link web checkout from inside the Android app UI to evade Play Billing.
- **Account deletion:** both the in-app button AND the public web URL must exist at submission time, or Google Play strictly rejects apps with account creation.

## 5. Pre-submit verification

- [ ] Signed `.aab` installs and runs on a real Android device (not just emulator).
- [ ] Push notification received on a real device (FCM wired, not just placeholder).
- [ ] Badge downloads to gallery / shares via native Share Sheet.
- [ ] Delete-account flow works end-to-end (request → confirmation → data wiped).
- [ ] No real secrets in the bundle; all keys come from the Play Console / server env, not hard-coded.
- [ ] Final app name (AuthorMarquee), confirmed domain, icon, and screenshots match before clicking Submit. Do not submit with planned-but-unbought domain URLs.
