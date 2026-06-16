"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { mapUserRow } from "@/lib/mappers";
import type { UserDetails } from "@/types/user-details";

/**
 * Extended user profile combining `public.users` data with Supabase auth metadata.
 * Used by the account page to display and conditionally render settings panels.
 */
export type UserProfile = UserDetails & {
  /** The user's email address sourced from `auth.users`. */
  email: string;
  /** OAuth provider identifier (e.g. `'email'`, `'github'`, `'google'`). */
  provider: string;
  /** True when the account has an email/password identity and may update the password. */
  canChangePassword: boolean;
};

/**
 * Server action. Retrieves the full profile of the currently authenticated user.
 * Combines data from `auth.users` (email, identities) and `public.users` (display name, avatar).
 * Returns null when the user is unauthenticated or has no row in `public.users`.
 *
 * @returns An object wrapping the user profile, or null if not authenticated or not found.
 * @author Maruf Bepary
 */
const getUserProfile = async (): Promise<{ profile: UserProfile } | null> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  const provider = user.identities?.[0]?.provider ?? "unknown";
  const canChangePassword =
    user.identities?.some((i) => i.provider === "email") ?? false;

  return {
    profile: {
      ...mapUserRow(data),
      email: user.email ?? "",
      provider,
      canChangePassword,
    },
  };
};

export default getUserProfile;
