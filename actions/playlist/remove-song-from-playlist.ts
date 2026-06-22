/**
 * Server action to remove a song from a playlist.
 * Deletes the playlist_songs junction record without affecting the song or other playlists.
 *
 * @module actions/playlist/remove-song-from-playlist
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { PlaylistSongSchema } from "@/schemas/playlists/playlist-song.schema";

/**
 * Removes a song from a playlist by deleting the playlist_songs junction record.
 * Does not affect the song itself or other playlists containing the same song.
 * Idempotent: returns true if junction record didn't exist (no-op success).
 *
 * @param playlistId - UUID of the playlist to remove the song from
 * @param songId - ID of the song to remove
 * @returns true if successfully removed or junction didn't exist, false if database operation fails
 * @throws ValidationError if playlistId or songId is invalid
 * @throws DatabaseError if database operation fails
 * @see addSongToPlaylist for adding a song to a playlist
 * @see reorderPlaylistSongs for changing song positions
 * @author Maruf Bepary
 */
const removeSongFromPlaylist = async (
  playlistId: string,
  songId: number
): Promise<boolean> => {
  const parsed = PlaylistSongSchema.safeParse({ playlistId, songId });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  return !error;
};

export default removeSongFromPlaylist;
