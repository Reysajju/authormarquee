"use client";
import { useEffect, useMemo, useState } from "react";
import { dynamicSlotPrice, formatPrice } from "@/lib/draw";
import { GENRES, poolSizeForGenre, type Genre } from "@/lib/data";
import { formatCountdown, useNow } from "@/lib/live";
import { routeCheckout } from "@/lib/payments";

// SLOTS tab — interactive booking calendar with live dynamic pricing.
// Price = min(100, 10 + poolSize*0.25 + bookedSlots*8). Changing the genre or
// the demo pool size changes the price live, so authors see the formula work.
export default function BookPage() {
  const now = useNow();
  const [genre, setGenre] = useState<Genre>("Thriller & Mystery");
  const [poolBoost, setPoolBoost] = useState(0);
  const [position, setPosition] = useState<"#1_Hero" | "#2_Spotlight" | "#3_Spotlight">("#1_Hero");
  const [selected, setSelected] = useState<number | null>(3);
  const [booked, setBooked] = useState(false);
  const [extended, setExtended] = useState(false);
  const [offerSeconds, setOfferSeconds] = useState(24 * 60 * 60);
  useEffect(() => {
    const t = setInterval(() => setOfferSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const basePool = poolSizeForGenre(genre);
  const poolSize = basePool + poolBoost;
  const days = useMemo(() => {
    const out: { label: string; date: string; taken: boolean; bookedCount: number }[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      out.push({
        label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        date: d.toISOString().slice(0, 10),
        taken: [1, 5, 9, 14].includes(i),
        bookedCount: [1, 5, 9, 14].includes(i) ? 3 : (i % 4),
      });
    }
    return out;
  }, []);
  const selectedDay = selected !== null ? days[selected] : null;
  const price = dynamicSlotPrice(poolSize, selectedDay ? selectedDay.bookedCount : 2);
  const finalistPrice = Math.min(price, 25);
  const extendPrice = price / 2;

  return (
    <div className="animate-float-in space-y-5">
      <h1 className="text-2xl font-black text-white">Lock your spot 🎟️</h1>
      <label className="block text-sm font-bold text-slate-300">Genre
        <select value={genre} onChange={(e) => { setGenre(e.target.value as Genre); setBooked(false); }} className="mt-1 block w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2.5 text-white">
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white">Live pool size: {poolSize} books</p>
          <div className="flex gap-1">
            <button onClick={() => setPoolBoost((v) => Math.max(-40, v - 10))} className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">−10</button>
            <button onClick={() => setPoolBoost((v) => v + 10)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">+10</button>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-400">Demo control: watch the price move as the pool grows. Formula: min($100, $10 + pool × $0.25 + booked × $8).</p>
        <p className="mt-3 font-mono text-3xl font-black tabular-nums text-yellow-400">{formatPrice(price)} <span className="text-sm font-normal text-slate-400">per day · {position.replace("_", " ")}</span></p>
        <div className="mt-3 flex gap-2">
          {(["#1_Hero", "#2_Spotlight", "#3_Spotlight"] as const).map((p) => (
            <button key={p} onClick={() => setPosition(p)} className={`flex-1 rounded-full py-2 text-xs font-bold transition active:scale-95 ${position === p ? "bg-yellow-500 text-black" : "bg-white/10 text-slate-300"}`}>
              {p === "#1_Hero" ? "👑 #1 Hero" : p === "#2_Spotlight" ? "✦ #2 Spotlight" : "✦ #3 Spotlight"}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-red-500/60 bg-red-500/10 p-4">
        <p className="font-black text-white">🔥 Near-Miss Finalist Offer — 24-hour countdown</p>
        <p className="font-mono text-3xl font-black tabular-nums text-red-300">{formatCountdown(offerSeconds)} left</p>
        <p className="text-sm text-slate-300">Priority Slot Pass for {formatPrice(finalistPrice)} (dynamic price capped for finalists at $25 in this demo). This buys a guaranteed sponsored placement — it does NOT change your free-draw odds.</p>
      </section>

      <section>
        <h2 className="font-black text-white">Booking calendar — next 21 days</h2>
        <p className="text-xs text-slate-400">Tap an open day. Taken days show the live price they sold for.</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {days.map((d, i) => {
            const dayPrice = dynamicSlotPrice(poolSize, d.bookedCount);
            return (
              <button key={d.date} disabled={d.taken} onClick={() => { setSelected(i); setBooked(false); }}
                className={`rounded-2xl border p-3 text-left text-sm transition active:scale-95 ${d.taken ? "border-white/10 bg-white/[0.03] text-slate-500" : selected === i ? "border-yellow-500 bg-yellow-500 text-black" : "border-white/10 bg-white/[0.06] text-white"}`}>
                <span className="block font-bold">{d.label}</span>
                <span className="text-xs">{d.taken ? `Taken · was ${formatPrice(dayPrice)}` : `Open · ${formatPrice(dayPrice)}`}</span>
              </button>
            );
          })}
        </div>
      </section>

      <button onClick={() => setBooked(true)} disabled={selected === null || (selectedDay?.taken ?? false)}
        className="w-full rounded-full bg-yellow-500 py-3.5 font-black text-black transition active:scale-95 disabled:opacity-50">
        Book {selectedDay ? selectedDay.label : ""} — {formatPrice(price)}
      </button>
      {booked && (
        <div className="rounded-3xl bg-emerald-500/15 p-4 ring-1 ring-emerald-500/40">
          <p className="font-bold text-white">✓ Demo: slot recorded locally, no payment taken.</p>
          <p className="text-sm text-slate-300">Production routing: in-app → {routeCheckout("play_billing", "credits_25").target}; email/web → {routeCheckout("web_checkout", "credits_25").target}. See lib/payments.ts.</p>
          <button onClick={() => setExtended(true)} className="mt-3 w-full rounded-full border border-yellow-500/50 py-2.5 text-sm font-bold text-yellow-400">
            👑 Extend this slot 48h at 50% off — {formatPrice(extendPrice)} (was {formatPrice(price)})
          </button>
          {extended && <p className="mt-2 text-sm font-bold text-emerald-300">✓ Demo: 48h extension recorded locally at 50% off.</p>}
        </div>
      )}
      <p className="text-center text-xs text-slate-500">Midnight draw in {formatCountdown((() => { const n = now; const m = new Date(n); m.setHours(24, 0, 0, 0); return Math.max(0, Math.floor((m.getTime() - n.getTime()) / 1000)); })())} · Slots are placement only, never odds.</p>
    </div>
  );
}
