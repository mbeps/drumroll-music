/**
 * @fileoverview Server-side Supabase client factory.
 * Creates a Supabase client for Server Actions, API routes, and server-side rendering.
 * Manages cookie synchronization for secure server-side auth state.
 *
 * @author Maruf Bepary
 * @see createBrowserSupabaseClient
 * @see updateSupabaseSession
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { Database } from "@/types/database/types_db";

/**
 * Creates a Supabase client for server-side operations.
 * Syncs authentication cookies bidirectionally using @supabase/ssr helpers.
 * Suitable for Server Actions, API routes, and server-side rendering with auth.
 *
 * @returns Promise resolving to a Supabase client instance typed to the application database.
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set.
 * @throws Error if cookies() is called in a read-only context (in which case middleware handles sync).
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database, "public">(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        experimental: {
          passkey: true,
        },
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              (cookieStore as { set: (name: string, value: string, options: Record<string, unknown>) => void }).set(name, value, options)
            );
          } catch {
            // In RSC contexts cookies() is read-only; middleware keeps sessions fresh.
          }
        },
      },
    }
  );
};
