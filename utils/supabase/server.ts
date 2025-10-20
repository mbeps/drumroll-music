import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { Database } from "@/types/types_db";

/**
 * Creates a Supabase client scoped to the server.
 * It keeps auth cookies in sync using the new @supabase/ssr helpers.
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              (cookieStore as any).set(name, value, options)
            );
          } catch {
            // In RSC contexts cookies() is read-only; middleware keeps sessions fresh.
          }
        },
      },
    }
  );
};
