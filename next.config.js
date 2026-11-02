/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // picsum placeholder covers only; no Amazon images are used in this demo.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  // NOTE (Capacitor): this demo runs as a normal Next.js server app.
  // To ship a fully offline .aab, either deploy this web app and point
  // capacitor.config.ts `server.url` at it, or switch to static export
  // (output: 'export') once all routes are static-safe. Do not enable
  // export until claim/[slug] generateStaticParams covers every slug.
};

module.exports = nextConfig;
