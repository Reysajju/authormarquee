"use client";
import Link from "next/link";
import { useState } from "react";
import { GENRES, MOCK_BOOKS, poolSizeForGenre, trendingBooks } from "@/lib/data";
import { APP_NAME, TAGLINE } from "@/lib/brand";
import { formatCountdown, secondsToMidnight, useNow } from "@/lib/live";
import { MarqueeBulbs } from "@/components/AppShell";

// LANDING PAGE ONLY — this is what authormarquee.com shows.
// It is NOT the app. The real product is the Android app: tap "Open App Demo".
const FAQS = [
  { q: "Is the daily draw really free?", a: "Yes. 1 winner per genre, every day, at midnight. No payment, no entry fee. Paid purchases only buy a guaranteed sponsored front-page slot — they never change your draw odds." },
  { q: "How do I claim my book?", a: "Tap a claim link from your nomination email, or preview any book in the app. Set a password (or Google sign-in), and you are entered into the free draw. Claiming is free." },
  { q: "What does a sponsored slot cost?", a: "Dynamic pricing from $10 to $100: $10 + pool size × $0.25 + booked slots × $8, capped at $100. Finalists get a 24-hour Priority Slot offer. In the Android app you pay with Play Billing; email links use web checkout." },
  { q: "Is this a website or an app?", a: "An Android app first. This page is only the landing page. Download the app from Google Play when it launches, and everything — draw, slots, badges, push alerts — lives inside the app." },
  { q: "Can I delete my account?", a: "Yes, anytime: in the app under Profile → Settings, or from the public delete-account page linked in the footer. Google Play requires both." },
];

export default function LandingPage() {
  const now = useNow();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const trending = trendingBooks(4);
  return (
    <div className="bg-[#0a0a14] text-slate-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-xl font-black text-yellow-400">✦ {APP_NAME}</span>
        <div className="flex gap-2">
          <Link href="/app" className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black transition active:scale-95">Open App Demo →</Link>
          <span className="hidden rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300 sm:inline">Google Play · Coming soon</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-center">
        <MarqueeBulbs />
        <div className="mx-auto mt-4 flex max-w-fit justify-center"><MarqueeBulbs /></div>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
          Your name, <span className="text-yellow-400">in lights.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          AuthorMarquee puts your book on the front page. Enter the free daily draw, win the spotlight,
          or lock a guaranteed sponsored slot — all inside the Android app.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-yellow-300">
          ⏰ Next free draw in <span className="font-mono tabular-nums">{formatCountdown(secondsToMidnight(now))}</span>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/app" className="rounded-full bg-yellow-500 px-6 py-3 font-bold text-black transition active:scale-95">Open the app demo</Link>
          <Link href="/app/discover" className="rounded-full border border-white/25 px-6 py-3 font-bold transition active:scale-95">Browse featured books</Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">Free draw = always free. Paid = guaranteed placement only, never draw odds.</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-2xl font-black">How it works</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { t: "1 · Claim free", d: "Your book is already nominated. Claim it in one tap and enter the free draw." },
            { t: "2 · Win or go finalist", d: "Midnight: 1 free winner per genre + 10 finalists with a 24-hour slot offer." },
            { t: "3 · Own the front page", d: "Winner shines for a day. Sponsored slots ($10–$100) guarantee #1, #2 or #3 placement." },
          ].map((s) => (
            <div key={s.t} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-yellow-500/50">
              <p className="font-bold text-yellow-400">{s.t}</p><p className="mt-1 text-sm text-slate-300">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-2xl font-black">Trending now in the app</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((b) => (
            <Link key={b.id} href={`/book-detail/${b.id}`} className="rounded-3xl border border-white/10 bg-white/[0.06] p-3 transition hover:-translate-y-0.5 hover:border-yellow-500/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover_url} alt={b.title} className="h-40 w-full rounded-2xl object-cover" loading="lazy" />
              <p className="mt-2 font-bold leading-snug">{b.title}</p>
              <p className="text-sm text-slate-400">{b.author_name} · ⭐ {b.rating} · ↑ {b.upvote_count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-2xl font-black">10 genres, one front page each</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {GENRES.map((g) => (
            <Link key={g} href="/app/discover" className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:border-yellow-500/50">
              <p className="font-bold">{g}</p>
              <p className="text-sm text-slate-400">{poolSizeForGenre(g)} books in pool · {MOCK_BOOKS.filter((b) => b.genre === g).length} featured here</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-2xl font-black">Frequently asked questions</h2>
        <div className="mt-4 space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-white/10 bg-white/[0.06]">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left font-bold">
                {f.q}<span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p className="px-4 pb-4 text-sm text-slate-300">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-slate-400">
        <p>{APP_NAME} · {TAGLINE}</p>
        <p className="mt-2 flex flex-wrap justify-center gap-4">
          <Link href="/app" className="underline">App demo</Link>
          <Link href="/claim/b000000003" className="underline">Claim preview</Link>
          <Link href="/delete-account" className="underline">Delete account</Link>
        </p>
        <p className="mt-2 text-xs">Landing page only. The product is the AuthorMarquee Android app (Google Play, coming soon).</p>
      </footer>
    </div>
  );
}
