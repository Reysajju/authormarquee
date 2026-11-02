"use client";
import { useEffect, useRef, useState } from "react";
import { GENRES, HERO_BOOK, MOCK_BOOKS, type Genre } from "@/lib/data";
import { APP_NAME } from "@/lib/brand";

type Template = "Gold Marquee" | "Dark Spotlight" | "Minimal Crown";
const TEMPLATES: Record<Template, { bg1: string; bg2: string; accent: string; text: string }> = {
  "Gold Marquee": { bg1: "#111827", bg2: "#c9a227", accent: "#facc15", text: "#ffffff" },
  "Dark Spotlight": { bg1: "#0a0a14", bg2: "#312e81", accent: "#a5b4fc", text: "#ffffff" },
  "Minimal Crown": { bg1: "#fafaf9", bg2: "#e7e5e4", accent: "#b45309", text: "#1c1917" },
};

async function tryNativeShare(title: string, text: string) {
  try {
    const mod = await import("@capacitor/share").catch(() => null);
    if (mod) { await mod.Share.share({ title, text, dialogTitle: "Share your badge" }); return "native-share"; }
  } catch { /* fall through */ }
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try { await navigator.share({ title, text }); return "web-share"; } catch { return "share-cancelled"; }
  }
  return "download-only";
}

// BADGE STUDIO (app tab) — 3 templates, colour/genre/book pickers, live canvas preview.
export default function BadgePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState<Template>("Gold Marquee");
  const [genre, setGenre] = useState<Genre>(HERO_BOOK.genre);
  const [bookId, setBookId] = useState(HERO_BOOK.id);
  const [shareMsg, setShareMsg] = useState("");
  const book = MOCK_BOOKS.find((b) => b.id === bookId) ?? HERO_BOOK;
  const title = book.title;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const t = TEMPLATES[template];
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, t.bg1); grad.addColorStop(1, t.bg2);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = t.accent;
    for (let x = 60; x < 1080; x += 90) { ctx.beginPath(); ctx.arc(x, 90, 18, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x, 990, 18, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = t.text; ctx.textAlign = "center";
    ctx.font = "bold 64px sans-serif"; ctx.fillText(template === "Minimal Crown" ? "♛ OFFICIAL #1 ♛" : "★ OFFICIAL #1 ★", 540, 230);
    ctx.font = "bold 72px sans-serif"; ctx.fillText("FEATURED BOOK", 540, 330);
    ctx.font = "48px sans-serif"; ctx.fillText(`in ${genre}`, 540, 410);
    ctx.font = "bold 56px sans-serif";
    const words = title.split(" "); let line = ""; let y = 550;
    for (const w of words) {
      if ((line + " " + w).trim().length > 22) { ctx.fillText(line.trim(), 540, y); y += 70; line = w; } else line += " " + w;
    }
    if (line.trim()) ctx.fillText(line.trim(), 540, y);
    ctx.font = "40px sans-serif"; ctx.fillText(`by ${book.author_name}`, 540, y + 90);
    ctx.font = "40px sans-serif"; ctx.fillText(APP_NAME, 540, 920);
    ctx.font = "30px sans-serif"; ctx.fillText("Your name, in lights.", 540, 965);
  }, [genre, title, template, book.author_name]);

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const a = document.createElement("a");
    a.download = `author-marquee-badge-${template.toLowerCase().replace(/ /g, "-")}.png`;
    a.href = canvas.toDataURL("image/png"); a.click();
  };

  return (
    <div className="animate-float-in mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-black text-white">Media Kit &amp; Badge Studio</h1>
      <p className="text-sm text-slate-400">Generates “Official #1 Featured Book in [Genre]” graphics on Canvas. In the Android app, sharing uses the native Share Sheet via @capacitor/share.</p>
      <div className="flex gap-2">
        {(Object.keys(TEMPLATES) as Template[]).map((t) => (
          <button key={t} onClick={() => setTemplate(t)} className={`flex-1 rounded-full py-2.5 text-xs font-bold transition active:scale-95 ${template === t ? "bg-yellow-500 text-black" : "bg-white/10 text-slate-300"}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-bold text-slate-300">Book
          <select value={bookId} onChange={(e) => { setBookId(e.target.value); const b = MOCK_BOOKS.find((x) => x.id === e.target.value); if (b) setGenre(b.genre); }} className="mt-1 w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2.5 text-white">
            {MOCK_BOOKS.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.author_name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold text-slate-300">Genre
          <select value={genre} onChange={(e) => setGenre(e.target.value as Genre)} className="mt-1 w-full rounded-xl border border-white/20 bg-[#1a1a2e] px-3 py-2.5 text-white">
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
      </div>
      <canvas ref={canvasRef} width={1080} height={1080} className="w-full rounded-3xl border border-white/10 shadow-xl" />
      <p className="text-xs text-slate-500">Square preview (Instagram Post). Story/Reel (1080×1920) and Website HTML badge use the same text and colours — export sizes are a follow-up once a template is picked.</p>
      <div className="flex gap-2">
        <button onClick={download} className="flex-1 rounded-full bg-yellow-500 py-3 font-bold text-black transition active:scale-95">Download PNG</button>
        <button onClick={async () => { const r = await tryNativeShare("Official #1 Featured Book", `Official #1 Featured Book in ${genre}: ${title}`); setShareMsg(`Share result (demo): ${r}. In Capacitor Android this opens the native Share Sheet.`); }} className="flex-1 rounded-full border border-white/25 py-3 font-bold text-white transition active:scale-95">Share (native sheet)</button>
      </div>
      {shareMsg && <p className="text-sm text-slate-400">{shareMsg}</p>}
    </div>
  );
}
