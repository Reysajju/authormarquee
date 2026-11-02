"use client";

import { useState } from "react";
import Link from "next/link";

// Public account-deletion page — Play Console requirement.
// Demo only: no real account or data exists, so nothing is actually deleted.
// Production: wire this form to a Supabase Edge Function that verifies the
// email, deletes the author + books + pool entries + analytics rows, and
// confirms by email.
export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Delete my account &amp; data</h1>
      <p className="text-sm text-slate-600">
        Enter the email you signed up with. We will delete your profile, books, pool entries and analytics, and confirm by email.
        This page is also linked from Play Console → App Content → Account Deletion.
        Planned live URL: authormarquee.com/delete-account (domain not yet bought, so not live yet).
      </p>
      {!done ? (
        <form
          className="space-y-3 rounded-2xl border bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="block text-sm font-medium">
            Account email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="you@example.com" />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input required type="checkbox" className="mt-1" />
            I understand this permanently deletes my account and data.
          </label>
          <button className="w-full rounded-full bg-red-600 py-3 font-medium text-white">Request deletion</button>
          <p className="text-center text-xs text-slate-400">Demo placeholder — no data is deleted in this build.</p>
        </form>
      ) : (
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="font-bold">✓ Deletion request recorded (demo).</p>
          <p className="text-sm text-slate-600">In production, a confirmation would be sent to {email} and deletion completed within the Play policy window.</p>
          <Link href="/" className="mt-2 inline-block underline text-sm">Back to front page</Link>
        </div>
      )}
    </div>
  );
}
