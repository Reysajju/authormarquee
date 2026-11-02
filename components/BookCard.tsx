"use client";
import Link from "next/link";
import type { MockBook } from "@/lib/data";

export default function BookCard({ book, upvotes, voted, onUpvote }: {
  book: MockBook; upvotes: number; voted: boolean; onUpvote: (id: string) => void;
}) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-yellow-500/50 active:scale-[0.98]">
      <Link href={`/book-detail/${book.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.cover_url} alt={book.title} className="h-44 w-full rounded-2xl object-cover" loading="lazy" />
        <h3 className="mt-2 font-bold leading-snug text-white">{book.title}</h3>
        <p className="text-sm text-slate-400">{book.author_name} · {book.genre}</p>
        <p className="mt-1 text-sm text-yellow-400">⭐ {book.rating} ({book.review_count} reviews) · #{book.poolRank} in genre</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{book.blurb}</p>
      </Link>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onUpvote(book.id)}
          className={`flex-1 rounded-full px-3 py-2.5 text-sm font-bold transition active:scale-95 ${voted ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
          aria-pressed={voted}
        >
          <span className={voted ? "inline-block animate-bounce" : ""}>{voted ? "✓ Upvoted" : "↑ Upvote"}</span> · {upvotes}
        </button>
        <Link href={`/claim/${book.claim_slug}`} className="flex-1 rounded-full border border-yellow-500/50 px-3 py-2.5 text-center text-sm font-bold text-yellow-400">
          {book.claim_status === "claimed" ? "Claimed ✓" : "Claim book"}
        </Link>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500">Free upvotes only — they never cost money or buy draw odds.</p>
    </article>
  );
}
