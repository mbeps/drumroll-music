/**
 * Server action to update the profile image of an artist owned by the authenticated user.
 * Validates storage limits before confirming the update; removes old image from storage.
 * RLS enforces ownership via uploader_id.
 *
 * @module actions/artist/update-artist-image
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { UpdateArtistImageSchema } from "@/schemas/artists/update-artist-image.schema";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";
import { getFileSize } from "@/lib/storage-limit/get-file-size";

/**
 * Updates the profile image for an artist owned by the currently authenticated user.
 * Validates both per-user and global storage limits against the new image size (minus old image).
 * Removes the old image from the 'images' storage bucket before updating the record.
 *
 * @param artistId - UUID of the artist to update
 * @param imagePath - Path of the newly uploaded image in the 'images' storage bucket
 * @returns true on success, false on validation, authentication, ownership, storage limit, or database error
 * @throws ValidationError if artistId or imagePath is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the artist
 * @throws StorageLimitError if combined user or global storage limit would be exceeded
 * @throws DatabaseError if artist record not found or database operation fails
 * @see validateStorageLimits for storage limit validation logic
 * @see deleteArtistImage for removing only the image
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
