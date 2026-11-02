import "./globals.css";
import AppFrame from "@/components/AppFrame";
import { APP_NAME, TAGLINE } from "@/lib/brand";
import type { Metadata } from "next";

// MOBILE APP FIRST: the app lives inside AppFrame (phone shell + bottom nav).
// The root route (/) is only the landing page for authormarquee.com.
// App routes (/app, /dashboard, /book, /badge, /settings) get the app shell;
// landing, claim-preview and delete-account pages stay full-width.
export const metadata: Metadata = {
  title: `${APP_NAME} — ${TAGLINE}`,
  description: "AuthorMarquee Android app: free daily genre draw, sponsored front-page slots and author media kits. authormarquee.com is only the landing page.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a14] text-slate-100 antialiased">
        <AppFrame>{children}</AppFrame>
        <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-center text-xs text-slate-500">
          {APP_NAME} · {TAGLINE} · Demo build · Free draw is always free — paid slots are guaranteed placement only, never draw odds.
        </footer>
      </body>
    </html>
  );
}
