"use client";
import { MOCK_NOTIFICATIONS } from "@/lib/data";
export default function NotificationsFeed() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <h2 className="font-bold text-white">🔔 Notifications <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">2 new</span></h2>
      <p className="text-xs text-slate-400">Mock FCM-style feed — in the Android app these arrive as push notifications.</p>
      <ul className="mt-3 space-y-2">
        {MOCK_NOTIFICATIONS.map((n) => (
          <li key={n.id} className={`flex gap-3 rounded-2xl p-3 ${n.unread ? "bg-yellow-500/10 ring-1 ring-yellow-500/30" : "bg-white/[0.04]"}`}>
            <span className="text-xl leading-none">{n.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{n.title} <span className="ml-1 font-normal text-slate-500">{n.time}</span></p>
              <p className="text-sm text-slate-400">{n.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
