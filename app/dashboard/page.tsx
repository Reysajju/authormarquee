"use client";
import Link from "next/link";
import { useState } from "react";
import DefendCrownBanner from "@/components/DefendCrownBanner";
import NotificationsFeed from "@/components/NotificationsFeed";
import Sparkline from "@/components/Sparkline";
import { DEMO_AUTHOR, HERO_BOOK } from "@/lib/data";
import { formatCountdown, secondsToMidnight, useLiveCounters, useNow } from "@/lib/live";

// AUTHOR DASHBOARD (app tab) — live counters, 7-day chart, wallet, rank, slots, alerts.
export default function DashboardPage() {
  const now = useNow();
  const live = useLiveCounters({ impressions: 12480, pageViews: 3214, amazonClicks: 486 });
  const [notifOn, setNotifOn] = useState(true);
  const stats = [
    { label: "Impressions", value: live.impressions.toLocaleString(), live: true },
    { label: "Page Views", value: live.pageViews.toLocaleString(), live: true },
    { label: "Amazon Clicks", value: live.amazonClicks.toLocaleString(), live: true },
    { label: "Upvotes", value: "511", live: false },
  ];
  return (
    <div className="animate-float-in space-y-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-white">Author dashboard</h1>
          <p className="text-sm text-slate-400">{DEMO_AUTHOR.name} · {DEMO_AUTHOR.email}</p>
        </div>
        <button onClick={() => setNotifOn(!notifOn)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${notifOn ? "bg-yellow-500 text-black" : "bg-white/10 text-slate-300"}`}>
          {notifOn ? "🔔 Push ON" : "🔕 Push OFF"}
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-700 p-4 text-black">
        <p className="text-xs font-black uppercase">⏰ Next midnight draw</p>
        <p className="font-mono text-3xl font-black tabular-nums">{formatCountdown(secondsToMidnight(now))}</p>
        <p className="text-sm font-medium">Share your link before midnight — free sharing boosts your odds, paying never does.</p>
      </div>

      <DefendCrownBanner title={HERO_BOOK.title} genre={HERO_BOOK.genre} impressionsToday={184} basePrice={25} />

      <section className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center transition hover:border-yellow-500/40">
            <p className="font-mono text-2xl font-black tabular-nums text-white">{s.value}{s.live && <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 align-middle" />}</p>
            <p className="text-xs text-slate-400">{s.label}{s.live ? " · live" : ""}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">Last 7 days — impressions</h2>
        <Sparkline values={HERO_BOOK.series7} />
        <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">Today&apos;s genre pool</h2>
        <p className="mt-1 text-lg text-white">Rank <strong className="text-yellow-400">#14 of 162</strong> in Thriller &amp; Mystery</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-yellow-500 to-emerald-400 transition-all" />
        </div>
        <p className="mt-1 text-xs text-slate-400">Top ~9% — finalist range for the midnight draw. Share to climb: each free share can boost odds up to 3x.</p>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-full bg-yellow-500 py-2.5 text-sm font-bold text-black transition active:scale-95">🔗 Share my page</button>
          <Link href="/app/discover" className="flex-1 rounded-full border border-white/25 py-2.5 text-center text-sm font-bold text-white">See rivals</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-yellow-500/40 bg-yellow-500/10 p-4">
          <p className="text-xs font-bold text-yellow-300">💰 Credits wallet</p>
          <p className="mt-1 text-2xl font-black text-white">${DEMO_AUTHOR.creditsBalance}</p>
          <p className="text-xs text-slate-400">Ad Slot Credits — Play Billing in the app</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs font-bold text-slate-400">🎟️ Active slots</p>
          <p className="mt-1 text-2xl font-black text-white">{DEMO_AUTHOR.activeSlots} slots</p>
          <p className="text-xs text-slate-400">#2 Spotlight · ends in 9h</p>
        </div>
      </section>

      <NotificationsFeed />

      <section className="flex flex-wrap gap-2">
        <Link href="/book" className="rounded-full bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black">Book a sponsored slot</Link>
        <Link href="/badge" className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold text-white">Badge Studio</Link>
        <Link href="/settings" className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold text-white">Settings</Link>
      </section>
    </div>
  );
}
