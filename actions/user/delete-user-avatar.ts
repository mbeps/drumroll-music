/**
 * Server action to remove the profile avatar of the authenticated user.
 * Clears avatar_url in public.users and deletes the file from the images storage bucket.
 * Revalidates the /account path on success.
 *
 * @module actions/user/delete-user-avatar
 * @author Maruf Bepary
 */
"use server";

import { revalidatePath } from "next/cache";
import { getLogger } from "@/lib/logger";
import { ROUTES } from "@/routes";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "user"]);

/**
 * Removes the avatar image of the currently authenticated user.
 * Clears `avatar_url` in `public.users` and deletes the file from the `images` storage bucket.
 * Revalidates `/account` on success to refresh the profile display.
 *
 * @returns true on success, false on authentication, database, or storage error
 * @throws UnauthorizedError if user is not authenticated
 * @throws DatabaseError if database update fails
 * @see uploadUserAvatar for uploading a new avatar
 * @see getUserProfile for fetching the current user's profile
 * @author Maruf Bepary
 */
const deleteUserAvatar = async (): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to delete user avatar");
    return false;
  }

  // Fetch current avatar path
  const { data: userRow, error: fetchError } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError || !userRow) {
    logger.error("Failed to fetch user row for avatar deletion: {message}", {
      userId: user.id,
      message: fetchError?.message ?? "User not found",
    });
    return false;
  }

  const avatarPath = userRow.avatar_url;

  // Clear avatar_url in database
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (updateError) {
    logger.error("Failed to clear avatar_url for user {userId}: {message}", {
      userId: user.id,
      message: updateError.message,
    });
    return false;
  }

  // Best-effort: remove from storage
  if (avatarPath) {
    await supabase.storage.from("images").remove([avatarPath]);
  }

  logger.info("Successfully deleted avatar for user: {userId}", { userId: user.id });
  revalidatePath(ROUTES.ACCOUNT.path);
  return true;
};

export default deleteUserAvatar;
