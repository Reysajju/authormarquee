"use client";
import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

// Routes that live INSIDE the mobile app shell (bottom nav + phone frame).
const APP_PREFIXES = ["/app", "/dashboard", "/book", "/badge", "/settings", "/book-detail"];
export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isApp) return <AppShell>{children}</AppShell>;
  return <>{children}</>;
}
