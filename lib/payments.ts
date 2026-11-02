// Dual-billing routing — notes + placeholders. NO real checkout calls.
// Rule summary (see README + PLAYSTORE_CHECKLIST.md):
// - In-app (Android): Google Play Billing via RevenueCat for "Ad Slot Credits".
//   These buy GUARANTEED sponsored placement only — never draw odds.
// - Web/email (0% Google tax): Stripe / DodoPay web checkout links sent by
//   email ("Near-Miss Finalist Offer", "Defend Your Crown"). Google Play
//   permits emailing users outside the app with web checkout links.
// - The free daily draw is always free; never gate it behind a payment.

export type PaymentSource = "play_billing" | "web_checkout";

export interface CreditPack {
  id: string;
  credits: number;
  price_usd: number;
  label: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "credits_10", credits: 10, price_usd: 9.99, label: "$9.99 pack" },
  { id: "credits_25", credits: 25, price_usd: 24.99, label: "$24.99 pack" },
  { id: "credits_50", credits: 50, price_usd: 49.99, label: "$49.99 pack" },
  { id: "credits_100", credits: 100, price_usd: 99.99, label: "$99.99 pack" },
];

export interface CheckoutRoute {
  source: PaymentSource;
  // In production: RevenueCat purchase (in-app) or Stripe/DodoPay URL (web).
  // In this demo: a placeholder string — no payment is attempted.
  target: string;
  note: string;
}

export function routeCheckout(source: PaymentSource, packId: string): CheckoutRoute {
  if (source === "play_billing") {
    return {
      source,
      target: `revenuecat://purchase/${packId}`,
      note: "Placeholder: wire to RevenueCat + Google Play Billing before launch. Requires RevenueCat Android key + Play Console products.",
    };
  }
  return {
    source,
    target: `/checkout/web?pack=${packId}`,
    note: "Placeholder: wire to Stripe / DodoPay web checkout. This route is for email-driven upsells only, outside the Android app, so Google takes 0%.",
  };
}

export const PAYMENT_POLICY_NOTE =
  "Paid purchases = Guaranteed Sponsored Placement / Ad Slot Booking ONLY. " +
  "The free draw is never paid, and paid purchases never increase draw odds.";
