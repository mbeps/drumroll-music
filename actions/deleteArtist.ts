"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Deletes an artist owned by the currently authenticated user.
 * The DB CASCADE removes album_artists rows (artist credit on albums).
 * The albums themselves are not deleted.
 * Also best-effort removes the profile image from storage.
 *
 * @param artistId - ID of the artist to delete
 * @returns true on success, false otherwise
 */
const deleteArtist = async (artistId: string): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Fetch artist to verify ownership and get image path for cleanup
  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("image_url, uploader_id")
    .eq("id", artistId)
    .maybeSingle();

  if (fetchError || !artist) return false;
  if (artist.uploader_id !== user.id) return false;

  // Delete artist (CASCADE removes album_artists rows)
  const { error: deleteError } = await supabase
    .from("artists")
    .delete()
    .eq("id", artistId);

  if (deleteError) return false;

  // Best-effort: remove the profile image from storage
  if (artist.image_url) {
    await supabase.storage.from("images").remove([artist.image_url]);
  }

  return true;
};

export default deleteArtist;
