"use client";
import Link from "next/link";
import type { MockBook } from "@/lib/data";
export default function Leaderboard({ title, books }: { title: string; books: MockBook[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <h2 className="font-bold text-white">{title}</h2>
      <ol className="mt-3 space-y-2">
        {books.map((b, i) => (
          <li key={b.id}>
            <Link href={`/book-detail/${b.id}`} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2 transition hover:bg-white/10 active:scale-[0.98]">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-slate-300 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-white/10 text-slate-300"}`}>{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover_url} alt={b.title} className="h-12 w-9 shrink-0 rounded-md object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">{b.title}</span>
                <span className="block truncate text-xs text-slate-400">{b.author_name} · ⭐ {b.rating}</span>
              </span>
              <span className="shrink-0 text-sm font-bold text-yellow-400">↑ {b.upvote_count}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
