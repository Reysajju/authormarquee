import Link from "next/link";
// In-app Profile/Settings tab — includes the Play-required in-app delete button.
// Demo placeholder: no real account exists yet.
export default function SettingsPage() {
  return (
    <div className="animate-float-in mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-black text-white">Profile &amp; Settings</h1>
      <section className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
        <p><strong className="text-white">Account:</strong> demo-author@example.com (demo)</p>
        <p><strong className="text-white">Push notifications:</strong> FCM placeholder — wire @capacitor/push-notifications + FCM keys before launch. Toggle is on the Dashboard.</p>
        <p><strong className="text-white">Credits balance:</strong> $25 (demo)</p>
        <p><strong className="text-white">App:</strong> AuthorMarquee · com.authormarquee.app · Android app demo</p>
      </section>
      <section className="rounded-3xl border border-red-500/40 bg-red-500/10 p-4">
        <h2 className="font-black text-red-300">Delete My Account &amp; Data</h2>
        <p className="mt-1 text-sm text-slate-300">Google Play requires this button in-app AND a public deletion URL. This button links to the public page.</p>
        <Link href="/delete-account" className="mt-3 inline-block rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white">Delete My Account &amp; Data</Link>
      </section>
      <Link href="/" className="block text-center text-sm font-bold text-yellow-400">← Back to landing page</Link>
    </div>
  );
}
