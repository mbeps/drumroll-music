"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { UpdateArtistImageSchema } from "@/schemas/artists/update-artist-image.schema";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";
import { getFileSize } from "@/lib/storage-limit/get-file-size";

/**
 * Updates the profile image for an artist owned by the currently authenticated
 * user. Removes the old image from storage if applicable. Server-side only.
 *
 * @param artistId - ID of the artist to update
 * @param imagePath - The new image path in the 'images' bucket
 * @returns true on success, false otherwise
 * @author Maruf Bepary
 */
const updateArtistImage = async (
  artistId: string,
  imagePath: string
): Promise<boolean> => {
  const parsed = UpdateArtistImageSchema.safeParse({ artistId, imagePath });
  if (!parsed.success) return false;

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

  // Storage limit validation
  // Since the image is already uploaded by the client, we check its size in storage
  const newImageSize = await getFileSize("images", imagePath);
  const oldImageSize = oldImagePath ? await getFileSize("images", oldImagePath) : 0;
  
  const limitCheck = await validateStorageLimits(newImageSize, user.id, oldImageSize);
  
  if (!limitCheck.ok) {
    // Cleanup: remove the newly uploaded image that exceeded the limit
    await supabase.storage.from("images").remove([imagePath]);
    return false;
  }

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
