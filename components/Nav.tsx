import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 text-sm">
        <Link href="/" className="font-bold text-lg text-slate-900">
          ✦ {APP_NAME}
        </Link>
        <div className="ml-auto flex gap-3 overflow-x-auto whitespace-nowrap">
          <Link href="/">Front Page</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/book">Book a Slot</Link>
          <Link href="/badge">Badge Studio</Link>
          <Link href="/settings">Settings</Link>
        </div>
      </nav>
      <p className="mx-auto max-w-5xl px-4 pb-2 text-[11px] text-slate-500">
        Demo build with mock data — no real payments, no real accounts yet.
      </p>
    </header>
  );
}
