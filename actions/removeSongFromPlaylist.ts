import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Removes a song from a playlist by deleting the playlist_songs junction record.
 * Does not affect the song itself or other playlists containing the same song.
 *
 * @param playlistId - UUID of the playlist to remove the song from
 * @param songId - ID of the song to remove
 * @returns true if song was successfully removed, false if removal fails
 * @author Maruf Bepary
 */
const removeSongFromPlaylist = async (
  playlistId: string,
  songId: number
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  return !error;
};

export default removeSongFromPlaylist;
