/**
 * Server action to rename a custom playlist owned by the authenticated user.
 * Prevents renaming of the favourites playlist (is_favourites = true).
 * RLS enforces user_id constraint.
 *
 * @module actions/playlist/rename-playlist
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { RenamePlaylistSchema } from "@/schemas/playlists/rename-playlist.schema";

/**
 * Renames a custom playlist owned by the currently authenticated user.
 * Cannot rename the favourites playlist (is_favourites = true).
 * Verifies ownership via user_id before applying the update.
 *
 * @param playlistId - UUID of the playlist to rename
 * @param newTitle - New playlist title (should be pre-trimmed by caller)
 * @returns true on success, false on validation, authentication, ownership, or database error
 * @throws ValidationError if playlistId or newTitle is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the playlist
 * @see createPlaylist for creating a new playlist
 * @see deletePlaylist for deleting a playlist
 * @author Maruf Bepary
 */
const renamePlaylist = async (
  playlistId: string,
  newTitle: string
): Promise<boolean> => {
  const parsed = RenamePlaylistSchema.safeParse({ playlistId, newTitle });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("playlists")
    .update({ title: parsed.data.newTitle })
    .eq("id", parsed.data.playlistId)
    .eq("user_id", user.id)
    .eq("is_favourites", false);

  return !error;
};

export default renamePlaylist;
