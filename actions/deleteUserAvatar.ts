"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Server action. Removes the avatar image of the currently authenticated user.
 * Clears `avatar_url` in `public.users` and deletes the file from the `images` storage bucket.
 * Revalidates `/account` on success.
 *
 * @returns true on success, false otherwise.
 * @author Maruf Bepary
 */
const deleteUserAvatar = async (): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Fetch current avatar path
  const { data: userRow, error: fetchError } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError || !userRow) return false;

  const avatarPath = userRow.avatar_url;

  // Clear avatar_url in database
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (updateError) return false;

  // Best-effort: remove from storage
  if (avatarPath) {
    await supabase.storage.from("images").remove([avatarPath]);
  }

  revalidatePath("/account");
  return true;
};

export default deleteUserAvatar;
