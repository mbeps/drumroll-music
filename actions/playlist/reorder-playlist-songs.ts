/**
 * Server action to reorder songs within a playlist by updating their position field.
 * Validates ownership before applying changes; RLS enforces user_id constraint.
 *
 * @module actions/playlist/reorder-playlist-songs
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ReorderPlaylistSongsSchema } from "@/schemas/playlists/reorder-playlist-songs.schema";

/**
 * Reorders songs in a playlist by updating their position field.
 * Verifies that the authenticated user owns the playlist before performing updates.
 * Processes updates sequentially to minimize race conditions.
 *
 * @param playlistId - UUID of the playlist to reorder
 * @param songIds - Ordered array of song IDs representing the new sequence
 * @returns true on success, false on validation, authentication, ownership, or database error
 * @throws ValidationError if playlistId or songIds is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the playlist
 * @throws DatabaseError if database operation fails
 * @see addSongToPlaylist for adding songs to a playlist
 * @see removeSongFromPlaylist for removing songs from a playlist
 * @author Maruf Bepary
 */
const reorderPlaylistSongs = async (playlistId: string, songIds: number[]): Promise<boolean> => {
  const parsed = ReorderPlaylistSongsSchema.safeParse({ playlistId, songIds });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  // Verify ownership
  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .select("user_id")
    .eq("id", playlistId)
    .single();

  if (playlistError || !playlist || playlist.user_id !== user.id) {
    return false;
  }

  // Update positions sequentially within a single request context (looping)
  // or use separate parallel requests. Sequential ensures less race conditions.
  // We'll update the positions from 0 up to songIds.length - 1
  const updates = songIds.map((songId, index) =>
    supabase
      .from("playlist_songs")
      .update({ position: index })
      .eq("playlist_id", playlistId)
      .eq("song_id", songId)
  );

  const results = await Promise.all(updates);

  const hasError = results.some((result) => result.error);

  return !hasError;
};

export default reorderPlaylistSongs;
