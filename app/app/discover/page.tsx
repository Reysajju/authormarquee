"use client";
import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";
import Leaderboard from "@/components/Leaderboard";
import { GENRES, MOCK_BOOKS, leaderboardForGenre, trendingBooks, type Genre } from "@/lib/data";
import { useUpvotes } from "@/lib/live";

type Sort = "upvotes" | "rating" | "newest";
type ClaimFilter = "all" | "unclaimed" | "claimed";

// DISCOVER tab — search, genre tabs, sort and claim filter, all client-side.
export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | "All">("All");
  const [sort, setSort] = useState<Sort>("upvotes");
  const [claim, setClaim] = useState<ClaimFilter>("all");
  const upvotes = useUpvotes(Object.fromEntries(MOCK_BOOKS.map((b) => [b.id, b.upvote_count])));

  const results = useMemo(() => {
    let list = [...MOCK_BOOKS];
    if (genre !== "All") list = list.filter((b) => b.genre === genre);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author_name.toLowerCase().includes(q));
    }
    if (claim !== "all") list = list.filter((b) => b.claim_status === claim);
    if (sort === "upvotes") list.sort((a, b) => upvotes.countFor(b.id) - upvotes.countFor(a.id));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => b.publishedYear - a.publishedYear);
    return list;
  }, [genre, query, sort, claim, upvotes]);

  return (
    <div className="animate-float-in space-y-5">
      <h1 className="text-2xl font-black text-white">Discover books</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or author…"
        className="w-full rounded-full border border-white/20 bg-white/[0.07] px-4 py-3 text-white placeholder:text-slate-500" />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["All", ...GENRES] as const).map((g) => (
          <button key={g} onClick={() => setGenre(g as Genre | "All")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${genre === g ? "bg-yellow-500 text-black" : "bg-white/10 text-slate-300"}`}>{g}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <label className="flex-1 text-xs font-bold text-slate-400">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-1 block w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2 text-sm text-white">
            <option value="upvotes">Most upvoted</option><option value="rating">Highest rated</option><option value="newest">Newest</option>
          </select>
        </label>
        <label className="flex-1 text-xs font-bold text-slate-400">Claim status
          <select value={claim} onChange={(e) => setClaim(e.target.value as ClaimFilter)} className="mt-1 block w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2 text-sm text-white">
            <option value="all">All books</option><option value="unclaimed">Unclaimed</option><option value="claimed">Claimed</option>
          </select>
        </label>
      </div>
      <p className="text-sm text-slate-400">{results.length} book{results.length === 1 ? "" : "s"} found{query ? ` for “${query}”` : ""}.</p>
      {results.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center">
          <p className="font-bold text-white">No books match that search.</p>
          <p className="text-sm text-slate-400">Try a different title, author, genre or claim filter.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {results.map((b) => <BookCard key={b.id} book={b} upvotes={upvotes.countFor(b.id)} voted={upvotes.hasVoted(b.id)} onUpvote={upvotes.toggle} />)}
      </div>
      <Leaderboard title="🏆 Leaderboard — this genre" books={leaderboardForGenre(genre === "All" ? "Thriller & Mystery" : genre)} />
      <section>
        <h2 className="font-black text-white">🔥 Trending now</h2>
        <p className="text-sm text-slate-400">Ranked by upvotes × rating.</p>
        <div className="mt-2 grid grid-cols-1 gap-3">
          {trendingBooks(3).map((b) => <BookCard key={b.id} book={b} upvotes={upvotes.countFor(b.id)} voted={upvotes.hasVoted(b.id)} onUpvote={upvotes.toggle} />)}
        </div>
      </section>
    </div>
  );
}
