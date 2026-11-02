// Brand — single place for the display name in app copy.
// FINAL NAME (confirmed by user): AuthorMarquee.
// Tagline: "Your name, in lights."
// Planned site: https://authormarquee.com — PLANNED ONLY.
// The domain itself is NOT yet bought/confirmed, so authormarquee.com URLs
// in this repo (claim links, delete-account) are planned, not live.
// To rename in future: change APP_NAME here, plus package.json `name`,
// capacitor.config.ts `appId`/`appName`, and the README title.
export const APP_NAME = "AuthorMarquee";
export const TAGLINE = "Your name, in lights.";
export const APP_ID = "com.authormarquee.app";
export const PLANNED_SITE_URL = "https://authormarquee.com";
export const DOMAIN_CONFIRMED = false;
export const claimUrl = (slug: string) => `${PLANNED_SITE_URL}/claim/${slug}`;
export const deleteAccountUrl = `${PLANNED_SITE_URL}/delete-account`;
