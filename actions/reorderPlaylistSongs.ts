"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Reorders songs in a playlist by updating their position field.
 * Verifies that the authenticated user owns the playlist before performing updates.
 *
 * @param playlistId The ID of the playlist to reorder.
 * @param songIds An ordered array of song IDs representing the new sequence.
 * @returns A promise that resolves to true if reordering was successful, false otherwise.
 * @author Maruf Bepary
 */
const reorderPlaylistSongs = async (playlistId: string, songIds: number[]): Promise<boolean> => {
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
