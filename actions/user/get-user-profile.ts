/**
 * Server action to fetch extended user profile combining auth and public.users data.
 * Includes email, identity provider, and password change capability.
 * Used by Account settings page to display profile information and edit options.
 *
 * @module actions/user/get-user-profile
 * @author Maruf Bepary
 */
"use server";

import { getLogger } from "@/lib/logger";
import { mapUserRow } from "@/lib/mappers/user";
import type { UserProfile } from "@/types/user/user-profile";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "user"]);

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

  if (!user) {
    logger.debug("getUserProfile called without authenticated session");
    return null;
  }

  logger.debug("Fetching profile for user: {userId}", { userId: user.id });
  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  if (error || !data) {
    if (error) {
      logger.error("Failed to fetch profile row for user {userId}: {message}", {
        userId: user.id,
        message: error.message,
      });
    }
    return null;
  }

  const provider = user.identities?.[0]?.provider ?? "unknown";
  const canChangePassword = user.identities?.some((i) => i.provider === "email") ?? false;

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
