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

  // Refresh the session if one exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only validate the user if a session exists
  if (session) {
    await supabase.auth.getUser();
  }

  return response;
};
