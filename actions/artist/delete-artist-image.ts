"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteArtistSchema } from "@/schemas/artists/delete-artist.schema";

/**
 * Deletes the profile image of an artist owned by the currently authenticated
 * user. Removes the image from storage if applicable. Server-side only.
 *
 * @param artistId - ID of the artist to update
 * @returns true on success, false otherwise
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
