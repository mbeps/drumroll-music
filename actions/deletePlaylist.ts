"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeletePlaylistSchema } from "@/schemas/playlists/delete-playlist.schema";

/**
 * Deletes a playlist owned by the currently authenticated user. Server-side only.
 * Will not delete the favourites playlist (`is_favourites = true`).
 * The DB CASCADE removes all playlist_songs rows; the songs themselves are not affected.
 *
 * @param playlistId - UUID of the playlist to delete
 * @returns true on success, false if unauthenticated, playlist not found, or operation fails
 * @author Maruf Bepary
 */
const deletePlaylist = async (playlistId: string): Promise<boolean> => {
  const parsed = DeletePlaylistSchema.safeParse({ playlistId });
  if (!parsed.success) return false;

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
