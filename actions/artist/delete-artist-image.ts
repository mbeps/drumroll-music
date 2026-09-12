/**
 * Server action to remove the profile image of an artist owned by the authenticated user.
 * Clears the image_url field and removes the image file from storage.
 * RLS enforces ownership via uploader_id.
 *
 * @module actions/artist/delete-artist-image
 * @author Maruf Bepary
 */
"use server";

import { getLogger } from "@/lib/logger";
import { DeleteArtistSchema } from "@/schemas/artist/delete-artist.schema";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "artist"]);

/**
 * Removes the profile image of an artist owned by the currently authenticated user.
 * Sets image_url to null and deletes the image file from the 'images' storage bucket.
 *
 * @param artistId - UUID of the artist to update
 * @returns true on success, false on validation, authentication, ownership, or database error
 * @throws ValidationError if artistId is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the artist
 * @throws DatabaseError if artist record not found or database operation fails
 * @see updateArtistImage for replacing the image with a new one
 * @see deleteArtist for deleting the entire artist
 * @author Maruf Bepary
 */
const deleteArtistImage = async (artistId: string): Promise<boolean> => {
  const parsed = DeleteArtistSchema.safeParse({ artistId });
  if (!parsed.success) {
    logger.warn("Invalid input for deleting artist image: {error}", {
      error: parsed.error.issues[0]?.message,
    });
    return false;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to delete artist image");
    return false;
  }

  // 1. Fetch artist to verify ownership and get current image path for cleanup
  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("image_url, uploader_id")
    .eq("id", artistId)
    .maybeSingle();

  if (fetchError || !artist) {
    logger.warn("Artist not found for deleting image: {artistId}", { artistId });
    return false;
  }

  // Authorization check
  if (artist.uploader_id !== user.id) {
    logger.warn("Unauthorized attempt to delete artist image: {artistId}", { artistId });
    return false;
  }

  const oldImagePath = artist.image_url;

  // 2. Update the database - set image_url to null
  const { error: updateError } = await supabase
    .from("artists")
    .update({ image_url: null })
    .eq("id", artistId);

  if (updateError) {
    logger.error("Failed to delete artist image in database: {message}", {
      artistId,
      message: updateError.message,
    });
    return false;
  }

  // 3. Best-effort: cleanup old image from storage
  if (oldImagePath) {
    await supabase.storage.from("images").remove([oldImagePath]);
  }

  logger.info("Successfully deleted image for artist: {artistId}", { artistId });
  return true;
};

export default deleteArtistImage;
