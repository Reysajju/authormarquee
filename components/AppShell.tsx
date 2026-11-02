"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, TAGLINE } from "@/lib/brand";

// Native-app shell: sticky marquee header + bottom tab bar, phone-width centred.
// Used for app routes only (see AppFrame); landing/claim/delete pages stay full-width.
const TABS = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/discover", label: "Discover", icon: "🔍" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/book", label: "Slots", icon: "🎟️" },
  { href: "/settings", label: "Profile", icon: "👤" },
];

export function MarqueeBulbs() {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="marquee-bulb" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#0d0d18] text-slate-100 shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:my-0">
      <header className="sticky top-0 z-40 border-b border-yellow-500/30 bg-[#12121f]/95 px-4 pb-2 pt-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/app" className="text-lg font-black tracking-tight text-yellow-400">✦ {APP_NAME}</Link>
          <Link href="/app/discover" className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">🔔 2 new</Link>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400">{TAGLINE} · Android app demo · Free draw always free</p>
        <div className="mt-2"><MarqueeBulbs /></div>
      </header>
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 items-stretch justify-around border-t border-white/10 bg-[#12121f]/95 px-1 py-2 backdrop-blur">
        {TABS.map((t) => {
          const active = pathname === t.href || (t.href === "/app" && pathname === "/app");
          return (
            <Link key={t.href} href={t.href}
              className={`flex flex-1 flex-col items-center rounded-xl py-1.5 text-[11px] font-semibold transition active:scale-95 ${active ? "bg-yellow-500/15 text-yellow-400" : "text-slate-400"}`}>
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="mt-0.5">{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
