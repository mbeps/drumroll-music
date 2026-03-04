"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Renames a playlist owned by the currently authenticated user.
 * Will not rename the favourites playlist.
 *
 * @param playlistId - ID of the playlist to rename
 * @param newTitle - The new title for the playlist (should be pre-trimmed)
 * @returns true on success, false otherwise
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
