"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Renames a custom playlist owned by the currently authenticated user.
 * Will not rename the favourites playlist (is_favourites = true).
 * Requires user authentication via Supabase Auth.
 *
 * @param playlistId - UUID of the playlist to rename
 * @param newTitle - The new title for the playlist (should be pre-trimmed by caller)
 * @returns true if rename was successful, false if user is not authenticated, playlist not found, or operation fails
 * @author Maruf Bepary
 */
const renamePlaylist = async (
  playlistId: string,
  newTitle: string
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("playlists")
    .update({ title: newTitle })
    .eq("id", playlistId)
    .eq("user_id", user.id)
    .eq("is_favourites", false);

  return !error;
};

export default renamePlaylist;
