"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Deletes an artist owned by the currently authenticated user.
 * The DB CASCADE removes album_artists rows (artist credit on albums).
 * The albums themselves are not deleted.
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

  // Fetch artist to verify ownership
  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("uploader_id")
    .eq("id", artistId)
    .maybeSingle();

  if (fetchError || !artist) return false;
  if (artist.uploader_id !== user.id) return false;

  // Delete artist (CASCADE removes album_artists rows)
  const { error: deleteError } = await supabase
    .from("artists")
    .delete()
    .eq("id", artistId);

  return !deleteError;
};

export default deleteArtist;
