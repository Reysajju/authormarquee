"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/draw";

// Shown ONLY when the author's book is currently featured.
export default function DefendCrownBanner({
  title,
  genre,
  impressionsToday,
  basePrice,
}: {
  title: string;
  genre: string;
  impressionsToday: number;
  basePrice: number;
}) {
  const [extended, setExtended] = useState(false);
  const halfPrice = basePrice / 2;
  return (
    <section className="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 p-4 text-slate-900 shadow">
      <p className="text-xs font-bold uppercase tracking-wide">👑 Defend Your Crown — you are featured now</p>
      <h2 className="mt-1 text-lg font-bold leading-snug">
        {title} is #1 in {genre} today
      </h2>
      <p className="text-sm">
        {impressionsToday} impressions today. Extend your #1 spot for 48 hours at 50% off:{" "}
        <strong>{formatPrice(halfPrice)}</strong> (was {formatPrice(basePrice)}).
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setExtended(true)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Extend 48h — {formatPrice(halfPrice)}
        </button>
        <Link href="/badge" className="rounded-full bg-white px-4 py-2 text-sm font-medium">
          Get my badge
        </Link>
      </div>
      {extended && (
        <p className="mt-2 text-sm font-medium">
          ✓ Demo: extension recorded locally. In production this routes to web checkout (Stripe/DodoPay) or Play Billing — see lib/payments.ts.
        </p>
      )}
    </section>
  );
}
