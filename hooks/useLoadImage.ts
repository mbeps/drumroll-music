import { Song } from "@/types/types";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

/**
 * Loads the image for a song from Supabase Storage.
 *
 * @param song (Song): song for which to load the image
 * @returns (string | null): public URL of the image, or null if unavailable
 */
const useLoadImage = (song: Song | undefined): string | null => {
  const supabaseClient = useSupabaseClient();

  // If there is no song, return null
  if (!song) {
    return null;
  }

  // If the song has no image path, return null
  if (!song.image_path) {
    return null;
  }

  // Get the public URL of the image for the song
  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
