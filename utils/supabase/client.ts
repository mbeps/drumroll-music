import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/types/types_db";

/**
 * Creates a Supabase client for browser usage.
 * The helper from @supabase/ssr handles singleton reuse in the browser.
 */
export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
