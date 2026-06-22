/**
 * Server action to fetch extended user profile combining auth and public.users data.
 * Includes email, identity provider, and password change capability.
 * Used by Account settings page to display profile information and edit options.
 *
 * @module actions/user/get-user-profile
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { mapUserRow } from "@/lib/mappers/user";
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
 * Fetches the full profile of the currently authenticated user.
 * Combines data from `auth.users` (email, identities) and `public.users` (display name, avatar).
 * Returns null if user is unauthenticated or has no row in `public.users`.
 *
 * @returns Object with `profile: UserProfile` on success, or null on authentication or fetch failure
 * @throws UnauthorizedError if user is not authenticated
 * @throws DatabaseError if public.users row not found or query fails
 * @see updateUserProfile for updating display name
 * @see uploadUserAvatar for uploading a profile avatar
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
