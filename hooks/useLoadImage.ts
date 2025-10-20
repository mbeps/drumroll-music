import { Song } from "@/types/types";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

/**
 * Loads the image for a song from Supabase Storage.
 *
 * @param song (Song): song for which to load the image
 * @returns (string): public URL of the image
 */
const useLoadImage = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  // If there is no song, return null
  if (!song) {
    return null;
  }

  // Get the public URL of the image for the song
  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
