import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { Database } from "@/types/types_db";

/**
 * Creates a Supabase client scoped to the server.
 * It keeps auth cookies in sync using the new @supabase/ssr helpers.
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
