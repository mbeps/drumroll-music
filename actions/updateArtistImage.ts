"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Updates the profile image for an artist owned by the currently authenticated
 * user. Removes the old image from storage if applicable.
 *
 * @param artistId - ID of the artist to update
 * @param imagePath - The new image path in the 'images' bucket
 * @returns true on success, false otherwise
 */
const updateArtistImage = async (
  artistId: string,
  imagePath: string
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // 1. Fetch artist to verify ownership and get current image path for cleanup
  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("image_url, uploader_id")
    .eq("id", artistId)
    .maybeSingle();

  if (fetchError || !artist) return false;
  
  // Authorization check
  if (artist.uploader_id !== user.id) return false;

  const oldImagePath = artist.image_url;

  // 2. Update the database
  const { error: updateError } = await supabase
    .from("artists")
    .update({ image_url: imagePath })
    .eq("id", artistId);

  if (updateError) return false;

  // 3. Best-effort: cleanup old image from storage
  if (oldImagePath && oldImagePath !== imagePath) {
    await supabase.storage.from("images").remove([oldImagePath]);
  }

  return true;
};

export default updateArtistImage;
