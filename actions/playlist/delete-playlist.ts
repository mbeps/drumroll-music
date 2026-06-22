/**
 * Server action to delete a custom playlist owned by the authenticated user.
 * Prevents deletion of the favourites playlist (is_favourites = true).
 * RLS enforces user_id constraint; cascade removes all playlist_songs junction rows.
 *
 * @module actions/playlist/delete-playlist
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeletePlaylistSchema } from "@/schemas/playlists/delete-playlist.schema";

/**
 * Deletes a custom playlist owned by the currently authenticated user.
 * Cannot delete the favourites playlist (is_favourites = true).
 * Cascade removes all playlist_songs rows; songs themselves are not affected.
 *
 * @param playlistId - UUID of the playlist to delete
 * @returns Object with `ok: true` on success or `ok: false` with descriptive `error` string on failure
 * @throws ValidationError if playlistId is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the playlist
 * @throws DatabaseError if playlist not found or database operation fails
 * @see createPlaylist for creating a new playlist
 * @see renamePlaylist for renaming a playlist
 * @author Maruf Bepary
 */
const deletePlaylist = async (
  playlistId: string
): Promise<{ ok: boolean; error?: string }> => {
  const parsed = DeletePlaylistSchema.safeParse({ playlistId });
  if (!parsed.success) {
    return { ok: false, error: "Invalid playlist ID" };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Authenticated user not found" };
  }

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)
    .eq("user_id", user.id)
    .eq("is_favourites", false);

  if (error) {
    return { ok: false, error: "Failed to delete playlist" };
  }

  return { ok: true };
};

export default deletePlaylist;
