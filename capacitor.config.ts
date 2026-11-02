import type { CapacitorConfig } from "@capacitor/cli";

// Final name: AuthorMarquee. Planned site authormarquee.com (domain NOT yet bought/confirmed).
const config: CapacitorConfig = {
  appId: "com.authormarquee.app",
  appName: "AuthorMarquee",
  webDir: "out",
  // For this demo (server-rendered Next.js), point server.url at your deployed
  // web portal when you wrap it, e.g.:
  // server: { url: "https://authormarquee.com", cleartext: false },
  // For a fully bundled build, switch Next.js to static export first (see README).
  backgroundColor: "#111827",
};

export default config;
