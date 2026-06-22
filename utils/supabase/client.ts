/**
 * @fileoverview Browser-side Supabase client factory.
 * Creates and reuses a singleton Supabase client instance for client-side queries, mutations, and real-time subscriptions.
 * Enables WebAuthn/Passkey authentication for passwordless sign-in.
 *
 * @author Maruf Bepary
 * @see SupabaseProvider
 * @see createServerSupabaseClient
 */

import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import { Database } from "@/types/database/types_db";

/**
 * Creates a singleton Supabase client for browser-side operations.
 * Leverages @supabase/ssr helpers for automatic singleton reuse and auth state persistence.
 * Configures experimental WebAuthn support for passkey sign-in and sign-up.
 *
 * @returns Supabase client instance typed to the application database schema.
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set.
 */
export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database, "public">(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        experimental: {
          passkey: true,
        },
      },
    }
  );
