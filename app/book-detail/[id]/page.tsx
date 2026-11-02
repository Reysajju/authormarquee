"use client";
import Link from "next/link";
import { useState } from "react";
import Sparkline from "@/components/Sparkline";
import { booksByGenre, getBookById } from "@/lib/data";
import { useUpvotes } from "@/lib/live";

// Book detail — every fact about one book, plus similar books in the same genre.
export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = getBookById(params.id);
  const [shared, setShared] = useState(false);
  const upvotes = useUpvotes(book ? { [book.id]: book.upvote_count } : {});
  if (!book) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h1 className="text-xl font-black text-white">Book not found</h1>
        <p className="mt-2 text-sm text-slate-400">That book id does not exist in the demo data.</p>
        <Link href="/app/discover" className="mt-4 inline-block rounded-full bg-yellow-500 px-5 py-2.5 font-bold text-black">Browse books</Link>
      </div>
    );
  }
  const similar = booksByGenre(book.genre).filter((b) => b.id !== book.id).slice(0, 4);
  const voted = upvotes.hasVoted(book.id);
  return (
    <div className="mx-auto max-w-md space-y-5 px-4 py-6">
      <Link href="/app/discover" className="text-sm font-bold text-yellow-400">← Back to Discover</Link>
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.cover_url} alt={book.title} className="h-56 w-36 shrink-0 rounded-2xl object-cover ring-4 ring-yellow-500/60" />
        <div className="min-w-0">
          <h1 className="text-2xl font-black leading-tight text-white">{book.title}</h1>
          <p className="mt-1 text-slate-300">by {book.author_name}</p>
          <p className="mt-1 text-sm text-yellow-400">⭐ {book.rating} · {book.review_count} reviews · #{book.poolRank} in {book.genre}</p>
          <p className="mt-1 text-sm text-slate-400">{book.pages} pages · {book.publishedYear} · {book.language} · ${book.listPrice}</p>
          <p className="mt-1 text-sm"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${book.claim_status === "claimed" ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"}`}>{book.claim_status === "claimed" ? "Claimed by author" : "Unclaimed — claim it free"}</span></p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: "Impressions", v: book.impressions.toLocaleString() },
          { l: "Page views", v: book.pageViews.toLocaleString() },
          { l: "Amazon clicks", v: book.amazonClicks.toLocaleString() },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <p className="font-mono font-black tabular-nums text-white">{s.v}</p><p className="text-[11px] text-slate-400">{s.l}</p>
          </div>
        ))}
      </div>
      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">Last 7 days — impressions</h2>
        <Sparkline values={book.series7} />
        <p className="mt-1 text-xs text-slate-500">Demo series for this book. Live data comes from Supabase analytics_events later.</p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">About this book</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{book.longBlurb}</p>
        <h3 className="mt-4 font-bold text-white">About the author</h3>
        <p className="mt-1 text-sm text-slate-300">{book.authorBio}</p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">Reader reviews</h2>
        <ul className="mt-3 space-y-3">
          {book.reviews.map((r) => (
            <li key={r.name} className="rounded-2xl bg-white/[0.04] p-3">
              <p className="text-sm font-bold text-white">{r.name} <span className="text-yellow-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></p>
              <p className="mt-1 text-sm text-slate-300">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="space-y-2">
        <button onClick={() => upvotes.toggle(book.id)} className={`w-full rounded-full py-3 font-bold transition active:scale-95 ${voted ? "bg-yellow-500 text-black" : "bg-white text-black"}`}>
          {voted ? "✓ Upvoted" : "↑ Upvote"} · {upvotes.countFor(book.id)} — free, never buys odds
        </button>
        <button onClick={() => setShared(true)} className="w-full rounded-full border border-white/25 py-3 font-bold text-white transition active:scale-95">
          🔗 Share to boost — free upvotes
        </button>
        {shared && <p className="rounded-2xl bg-emerald-500/15 p-3 text-center text-sm text-emerald-200">✓ Share link copied in the demo. In the Android app this opens the native Share Sheet.</p>}
        <Link href={`/claim/${book.claim_slug}`} className="block rounded-full bg-yellow-500 py-3 text-center font-bold text-black transition active:scale-95">Claim this book — free</Link>
        <Link href="/book" className="block rounded-full border border-yellow-500/50 py-3 text-center font-bold text-yellow-400 transition active:scale-95">Book a sponsored slot ($10–$100)</Link>
        <a href={book.amazon_url} target="_blank" rel="noreferrer" className="block rounded-full border border-white/25 py-3 text-center font-bold text-white">Buy on Amazon</a>
      </div>
      <section>
        <h2 className="font-black text-white">Similar books in {book.genre}</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {similar.map((b) => (
            <Link key={b.id} href={`/book-detail/${b.id}`} className="rounded-3xl border border-white/10 bg-white/[0.06] p-2 transition active:scale-95">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover_url} alt={b.title} className="h-32 w-full rounded-2xl object-cover" loading="lazy" />
              <p className="mt-1 truncate text-sm font-bold text-white">{b.title}</p>
              <p className="truncate text-xs text-slate-400">{b.author_name} · ⭐ {b.rating}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
