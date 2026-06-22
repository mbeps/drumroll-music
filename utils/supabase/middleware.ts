/**
 * @fileoverview Supabase session refresh middleware for Next.js.
 * Handles server-side auth cookie synchronization and JWT token refresh in the middleware layer.
 * Prevents session stale-out across server requests by validating and refreshing tokens.
 *
 * @author Maruf Bepary
 * @see createServerSupabaseClient
 */

import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { Database } from "@/types/database/types_db";

/**
 * Refreshes Supabase auth cookies and JWT tokens within Next.js middleware.
 * Validates JWT claims locally and refreshes expired tokens to prevent "refresh_token_not_found" errors.
 * Must be called from middleware.ts for every request to maintain fresh auth state.
 *
 * @param request NextRequest object from middleware.
 * @returns NextResponse with updated auth cookies and refreshed session.
 * @throws Error if Supabase client creation fails due to missing environment variables.
 */
export const updateSupabaseSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  const { createServerClient } = await import("@supabase/ssr");

  const supabase = createServerClient<Database, "public">(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Refreshes the Auth token — validates the JWT locally and refreshes
  // expired tokens. Without this call, cookies go stale and subsequent
  // server requests may fail with "refresh_token_not_found".
  await supabase.auth.getClaims();

  return response;
};
