import { Song } from "@/types/types";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

// fetches song which will then be played
/**
 * Loads the URL for a song from Supabase Storage.
 * This is required for the song to be played.
 *
 * @param song (Song): song which needs a URL
 * @returns (string): public URL of the song
 */
const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  // If there is no song, return an empty string
  if (!song) {
    return "";
  }

  // Get the public URL of the song from Supabase Storage
  const { data: songData } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  return songData.publicUrl;
};

export default useLoadSongUrl;
