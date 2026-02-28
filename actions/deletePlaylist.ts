"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Deletes a playlist owned by the currently authenticated user.
 * Will not delete the favourites playlist.
 * The DB CASCADE removes all playlist_songs rows; the songs themselves are not affected.
 *
 * @param playlistId - ID of the playlist to delete
 * @returns true on success, false otherwise
 */
const deletePlaylist = async (playlistId: string): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)
    .eq("user_id", user.id)
    .eq("is_favourites", false);

  return !error;
};

export default deletePlaylist;
