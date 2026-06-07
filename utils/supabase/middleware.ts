import { NextResponse, type NextRequest } from "next/server";

import { Database } from "@/types/types_db";

/**
 * Keeps Supabase auth cookies in sync within Next.js middleware.
 */
export const updateSupabaseSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  const { createServerClient } = await import("@supabase/ssr");

  const supabase = createServerClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
