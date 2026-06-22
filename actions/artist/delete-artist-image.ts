/**
 * Server action to remove the profile image of an artist owned by the authenticated user.
 * Clears the image_url field and removes the image file from storage.
 * RLS enforces ownership via uploader_id.
 *
 * @module actions/artist/delete-artist-image
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteArtistSchema } from "@/schemas/artists/delete-artist.schema";

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
const deleteArtistImage = async (
  artistId: string
): Promise<boolean> => {
  const parsed = DeleteArtistSchema.safeParse({ artistId });
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

  // 2. Update the database - set image_url to null
  const { error: updateError } = await supabase
    .from("artists")
    .update({ image_url: null })
    .eq("id", artistId);

  if (updateError) return false;

  // 3. Best-effort: cleanup old image from storage
  if (oldImagePath) {
    await supabase.storage.from("images").remove([oldImagePath]);
  }

  return true;
};

export default deleteArtistImage;
