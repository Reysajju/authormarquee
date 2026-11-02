"use client";
import { useEffect, useState } from "react";

/** Ticks every second — drives all live countdowns and counters. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Seconds until local midnight (the daily draw moment in the demo). */
export function secondsToMidnight(now: Date): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/** Seconds until next Friday 00:00 — the weekly free-draw entry point used on Claim. */
export function secondsToFriday(now: Date): number {
  const d = new Date(now);
  const add = (5 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + add);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
  return Math.max(0, Math.floor((d.getTime() - now.getTime()) / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / 86400);
  const h = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
}

/**
 * Live counters: base value + a small deterministic tick-up over time,
 * so the dashboard and hero feel alive without any server or keys.
 * Stored per-session only (not persisted) — real values come from Supabase later.
 */
export function useLiveCounters(base: { impressions: number; pageViews: number; amazonClicks: number }) {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTicks((v) => v + 1), 4000);
    return () => clearInterval(t);
  }, []);
  return {
    impressions: base.impressions + ticks * 3 + Math.floor(ticks / 5),
    pageViews: base.pageViews + ticks,
    amazonClicks: base.amazonClicks + Math.floor(ticks / 3),
    ticks,
  };
}

/** Upvotes persisted in localStorage per book id. Returns map + toggle. */
export function useUpvotes(initial: Record<string, number>) {
  const [extra, setExtra] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("authormarquee-upvotes");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setVoted(parsed);
        setExtra(Object.fromEntries(Object.keys(parsed).map((k) => [k, 1])));
      }
    } catch { /* private mode — voting still works for the session */ }
  }, []);
  const toggle = (id: string) => {
    setVoted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { window.localStorage.setItem("authormarquee-upvotes", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setExtra((prev) => ({ ...prev, [id]: voted[id] ? 0 : 1 }));
  };
  const countFor = (id: string) => (initial[id] ?? 0) + (extra[id] ?? 0);
  const hasVoted = (id: string) => !!voted[id];
  return { countFor, hasVoted, toggle };
}
