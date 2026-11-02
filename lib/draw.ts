// Midnight draw + dynamic pricing — pure, testable logic.
// PLAY POLICY (do not violate): the random draw is 100% FREE.
// Paid purchases are ONLY "Guaranteed Sponsored Placement / Ad Slot Booking".
// Money must NEVER increase draw odds. Sharing/upvotes are free and are the
// only weighting factor, exactly as specified.

import type { EntryType, MockBook } from "./data";

export interface PoolEntry {
  book_id: string;
  genre: string;
  upvote_count: number;
  entry_type: EntryType;
}

export interface DrawResult {
  genre: string;
  draw_date: string; // YYYY-MM-DD
  winner_book_id: string;
  finalist_book_ids: string[];
  finalist_offer_expires_at: string; // ISO, winner/finalist time + 24h
}

/** Slot Price = min(100, 10 + poolSize*0.25 + bookedSlots*8). Range $10–$100. */
export function dynamicSlotPrice(poolSize: number, bookedSlots: number): number {
  return Math.min(100, Math.round((10 + poolSize * 0.25 + bookedSlots * 8) * 100) / 100);
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

/** Weighted random pick: weight = 1 + upvote_count (free sharing only, never paid). */
export function pickWeightedWinner(entries: PoolEntry[], random = Math.random): PoolEntry | null {
  if (entries.length === 0) return null;
  const total = entries.reduce((s, e) => s + 1 + e.upvote_count, 0);
  let roll = random() * total;
  for (const e of entries) {
    roll -= 1 + e.upvote_count;
    if (roll <= 0) return e;
  }
  return entries[entries.length - 1];
}

export function runGenreDraw(
  genre: string,
  entries: PoolEntry[],
  drawDate = new Date()
): DrawResult | null {
  const winner = pickWeightedWinner(entries);
  if (!winner) return null;
  const finalists = entries
    .filter((e) => e.book_id !== winner.book_id)
    .sort((a, b) => b.upvote_count - a.upvote_count)
    .slice(0, 10);
  const dateStr = drawDate.toISOString().slice(0, 10);
  const expires = new Date(drawDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
  return {
    genre,
    draw_date: dateStr,
    winner_book_id: winner.book_id,
    finalist_book_ids: finalists.map((f) => f.book_id),
    finalist_offer_expires_at: expires,
  };
}

/** Demo helper: build pool entries from mock books for one genre. */
export function entriesFromBooks(books: MockBook[], genre: string): PoolEntry[] {
  return books
    .filter((b) => b.genre === genre)
    .map((b) => ({ book_id: b.id, genre, upvote_count: b.upvote_count, entry_type: "free_draw" as EntryType }));
}
