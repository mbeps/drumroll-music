/**
 * Server action to add a song to a playlist.
 * Prevents duplicate songs in the same playlist (idempotent by design).
 * Automatically assigns the next available position.
 *
 * @module actions/playlist/add-song-to-playlist
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { PlaylistSongSchema } from "@/schemas/playlists/playlist-song.schema";

/**
 * Adds a song to a playlist at the next available position.
 * Checks for duplicates and prevents adding the same song twice (idempotent).
 * Automatically calculates and assigns the next position in the playlist order.
 *
 * @param playlistId - UUID of the playlist to add the song to
 * @param songId - ID of the song to add
 * @returns true on success or if song already exists in playlist, false if operation fails
 * @throws ValidationError if playlistId or songId is invalid
 * @throws DatabaseError if database operation fails
 * @see removeSongFromPlaylist for removing a song from a playlist
 * @see reorderPlaylistSongs for changing song positions
 * @author Maruf Bepary
 */
const addSongToPlaylist = async (
  playlistId: string,
  songId: number
): Promise<boolean> => {
  const parsed = PlaylistSongSchema.safeParse({ playlistId, songId });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  // Check if song already exists in this playlist
  const { data: existing } = await supabase
    .from("playlist_songs")
    .select("song_id")
    .eq("playlist_id", playlistId)
    .eq("song_id", songId)
    .single();

  if (existing) return false;

  // Get max position for this playlist
  const { data: maxPos } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (maxPos?.position ?? 0) + 1;

  const { error } = await supabase
    .from("playlist_songs")
    .insert({ playlist_id: playlistId, song_id: songId, position: nextPosition });

  return !error;
};

export default addSongToPlaylist;
