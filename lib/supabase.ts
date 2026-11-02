// Supabase client — guarded so the demo runs with NO keys.
// When NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are set, returns a real client;
// otherwise returns null and pages fall back to lib/data.ts mock data.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project") || key.includes("placeholder")) {
    client = null;
    return client;
  }
  client = createClient(url, key);
  return client;
}

export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
