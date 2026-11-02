"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";
import DefendCrownBanner from "@/components/DefendCrownBanner";
import Leaderboard from "@/components/Leaderboard";
import NotificationsFeed from "@/components/NotificationsFeed";
import { FREE_WINNER_BOOK, GENRES, HERO_BOOK, MOCK_BOOKS, MARQUEE_BOOKS, leaderboardForGenre, trendingBooks, type Genre } from "@/lib/data";
import { formatCountdown, secondsToMidnight, useLiveCounters, useNow, useUpvotes } from "@/lib/live";

// APP HOME — the billboard inside the mobile app (was the old web front page).
export default function AppHomePage() {
  const now = useNow();
  const live = useLiveCounters({ impressions: HERO_BOOK.impressions, pageViews: HERO_BOOK.pageViews, amazonClicks: HERO_BOOK.amazonClicks });
  const [genre, setGenre] = useState<Genre | "All">("All");
  const upvotes = useUpvotes(Object.fromEntries(MOCK_BOOKS.map((b) => [b.id, b.upvote_count])));
  const pool = useMemo(() => (genre === "All" ? MOCK_BOOKS : MOCK_BOOKS.filter((b) => b.genre === genre)), [genre]);
  const trending = trendingBooks(5);

  return (
    <div className="animate-float-in space-y-5">
      <section className="rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-700 p-4 text-black shadow-lg">
        <p className="text-xs font-black uppercase tracking-wide">⏰ Next free draw</p>
        <p className="mt-1 font-mono text-3xl font-black tabular-nums">{formatCountdown(secondsToMidnight(now))}</p>
        <p className="text-sm font-medium">1 free winner per genre at midnight. No payment, ever.</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Impressions", v: live.impressions.toLocaleString() },
            { l: "Page views", v: live.pageViews.toLocaleString() },
            { l: "Amazon clicks", v: live.amazonClicks.toLocaleString() },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-black/20 p-2">
              <p className="font-mono text-base font-black tabular-nums">{s.v}</p>
              <p className="text-[11px] font-semibold">{s.l} · live</p>
            </div>
          ))}
        </div>
      </section>

      <DefendCrownBanner title={HERO_BOOK.title} genre={HERO_BOOK.genre} impressionsToday={184} basePrice={25} />

      <section className="rounded-3xl border-4 border-yellow-500 bg-white/[0.06] p-4 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-yellow-400">#1 Hero Featured Book</p>
        <div className="mt-2 flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_BOOK.cover_url} alt={HERO_BOOK.title} className="h-40 w-28 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0">
            <Link href={`/book-detail/${HERO_BOOK.id}`} className="text-xl font-black leading-tight text-white hover:underline">{HERO_BOOK.title}</Link>
            <p className="text-sm text-slate-400">{HERO_BOOK.author_name} · {HERO_BOOK.genre} · ⭐ {HERO_BOOK.rating}</p>
            <p className="mt-1 line-clamp-3 text-sm text-slate-300">{HERO_BOOK.longBlurb}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/claim/${HERO_BOOK.claim_slug}`} className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black">Claim this book</Link>
              <Link href="/book" className="rounded-full border border-white/25 px-4 py-2 text-sm font-bold">Book a slot</Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-black text-white">#2 &amp; #3 Spotlight</h2>
        <div className="mt-2 grid grid-cols-1 gap-3">
          {MARQUEE_BOOKS.map((b) => <BookCard key={b.id} book={b} upvotes={upvotes.countFor(b.id)} voted={upvotes.hasVoted(b.id)} onUpvote={upvotes.toggle} />)}
        </div>
      </section>

      <section className="rounded-3xl bg-emerald-500/15 p-4 ring-1 ring-emerald-500/40">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-300">🎉 Today&apos;s Free Winner</p>
        <p className="mt-1 font-bold text-white">{FREE_WINNER_BOOK.title} — {FREE_WINNER_BOOK.author_name} ({FREE_WINNER_BOOK.genre})</p>
        <p className="text-sm text-slate-300">Won the free draw. No payment was involved.</p>
      </section>

      <section>
        <h2 className="font-black text-white">🔥 Trending now</h2>
        <div className="no-scrollbar -mx-4 mt-2 flex gap-3 overflow-x-auto px-4 pb-1">
          {trending.map((b) => (
            <Link key={b.id} href={`/book-detail/${b.id}`} className="w-36 shrink-0 rounded-3xl border border-white/10 bg-white/[0.06] p-2 transition active:scale-95">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover_url} alt={b.title} className="h-36 w-full rounded-2xl object-cover" loading="lazy" />
              <p className="mt-1 truncate text-sm font-bold text-white">{b.title}</p>
              <p className="text-xs text-slate-400">↑ {upvotes.countFor(b.id)} · ⭐ {b.rating}</p>
            </Link>
          ))}
        </div>
      </section>

      <Leaderboard title="🏆 Thriller & Mystery leaderboard" books={leaderboardForGenre("Thriller & Mystery")} />

      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-black text-white">Up-and-Coming Pool</h2>
          <select value={genre} onChange={(e) => setGenre(e.target.value as Genre | "All")} className="rounded-full border border-white/20 bg-[#1a1a2e] px-3 py-2 text-sm text-white" aria-label="Filter by genre">
            <option value="All">All genres</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {pool.map((b) => <BookCard key={b.id} book={b} upvotes={upvotes.countFor(b.id)} voted={upvotes.hasVoted(b.id)} onUpvote={upvotes.toggle} />)}
        </div>
        <Link href="/app/discover" className="mt-4 block rounded-full border border-yellow-500/50 py-3 text-center text-sm font-bold text-yellow-400">Search, sort &amp; filter all books →</Link>
      </section>

      <NotificationsFeed />
    </div>
  );
}
