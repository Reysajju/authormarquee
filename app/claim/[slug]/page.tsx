"use client";
import { useState } from "react";
import Link from "next/link";
import { getBookBySlug } from "@/lib/data";
import { formatCountdown, secondsToFriday, useNow } from "@/lib/live";

// CLAIM — landing-linked preview (NOT an app tab). Gold frame, full book facts,
// what-happens-next steps, and a live countdown to Friday's free draw.
// NOTE: no generateStaticParams here — a "use client" page cannot export it.
export default function ClaimPage({ params }: { params: { slug: string } }) {
  const book = getBookBySlug(params.slug);
  const now = useNow();
  const [entered, setEntered] = useState(false);
  const [email, setEmail] = useState("");

  if (!book) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-black text-white">Nomination not found</h1>
        <p className="mt-2 text-sm text-slate-400">No book matches claim slug “{params.slug}”. Try a demo link: <Link href="/claim/b000000003" className="text-yellow-400 underline">/claim/b000000003</Link></p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-6">
      <p className="text-center text-sm text-slate-300">Hi! Your book has been nominated for Friday&apos;s {book.genre} Front-Page Pool.</p>
      <div className="rounded-3xl border-4 border-yellow-500 bg-white/[0.06] p-4 text-center shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.cover_url} alt={book.title} className="mx-auto h-64 w-44 rounded-2xl object-cover ring-4 ring-yellow-400" />
        <h1 className="mt-3 text-xl font-black text-white">{book.title}</h1>
        <p className="text-sm text-slate-300">{book.author_name} · {book.genre} · ⭐ {book.rating} ({book.review_count} reviews)</p>
        <p className="mt-1 text-sm text-slate-400">{book.pages} pages · {book.publishedYear} · #{book.poolRank} in genre · ↑ {book.upvote_count} upvotes</p>
        <p className="mt-2 text-left text-sm text-slate-300">{book.longBlurb}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-yellow-400">Status: {book.claim_status} · Claim slug: {book.claim_slug}</p>
        <p className="mt-1 text-xs text-slate-500">Planned live link (domain not yet bought, so not live): authormarquee.com/claim/{book.claim_slug}</p>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-700 p-4 text-center text-black">
        <p className="text-xs font-black uppercase">⏰ Friday&apos;s free draw in</p>
        <p className="font-mono text-2xl font-black tabular-nums">{formatCountdown(secondsToFriday(now))}</p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
        <h2 className="font-black text-white">What happens next</h2>
        <ol className="mt-2 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">1 · Claim (free).</strong> Confirm this book is yours.</li>
          <li><strong className="text-white">2 · Free draw entry.</strong> You are in Friday&apos;s genre draw — 1 winner + 10 finalists.</li>
          <li><strong className="text-white">3 · Finalist / slot offer.</strong> Finalists get a 24h Priority Slot offer. Winners get the front page for a day.</li>
        </ol>
        <p className="mt-2 text-xs text-slate-500">Paying never changes draw odds. Paid slots are guaranteed placement only.</p>
      </section>

      {!entered ? (
        <form className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4" onSubmit={(e) => { e.preventDefault(); setEntered(true); }}>
          <label className="block text-sm font-bold text-slate-200">Email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2.5 text-white" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-bold text-slate-200">Create a password
            <input required type="password" className="mt-1 w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2.5 text-white" placeholder="••••••••" />
          </label>
          <button className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black transition active:scale-95">Enter Friday&apos;s Free Genre Draw</button>
          <button type="button" onClick={() => setEntered(true)} className="w-full rounded-full border border-white/25 py-3 text-sm font-bold text-white">Continue with Google (demo placeholder — no real sign-in)</button>
          <p className="text-center text-xs text-slate-500">Demo only: no account is created and no password is stored.</p>
        </form>
      ) : (
        <div className="rounded-3xl bg-emerald-500/15 p-4 text-center ring-1 ring-emerald-500/40">
          <p className="font-black text-white">✓ You&apos;re in Friday&apos;s free draw!</p>
          <p className="mt-1 text-sm text-slate-300">{email ? `Confirmation (demo) would go to ${email}. ` : ""}Share your page to boost free upvotes — sharing never costs money.</p>
          <div className="mt-3 flex gap-2 justify-center">
            <Link href="/app" className="rounded-full bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black">Open app demo</Link>
            <Link href="/book" className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold text-white">Book a sponsored slot</Link>
          </div>
        </div>
      )}
    </div>
  );
}
