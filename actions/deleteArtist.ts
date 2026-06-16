"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteArtistSchema } from "@/schemas/artists/delete-artist.schema";

/**
 * Deletes an artist owned by the currently authenticated user. Server-side only.
 * The DB CASCADE removes album_artists rows (artist credit on albums).
 * The albums themselves are not deleted.
 * Also best-effort removes the profile image from storage.
 *
 * @param artistId - ID of the artist to delete
 * @returns { ok: boolean, error?: string } on success/failure
 * @author Maruf Bepary
 */
const deleteArtist = async (
  artistId: string
): Promise<{ ok: boolean; error?: string }> => {
  const parsed = DeleteArtistSchema.safeParse({ artistId });
  if (!parsed.success) {
    return { ok: false, error: "Invalid artist ID" };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Authenticated user not found" };
  }

  // Fetch artist to verify ownership and get image path for cleanup
  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("image_url, uploader_id")
    .eq("id", artistId)
    .maybeSingle();

  if (fetchError || !artist) {
    return { ok: false, error: "Artist not found or error fetching artist" };
  }

  if (artist.uploader_id !== user.id) {
    return { ok: false, error: "You do not have permission to delete this artist" };
  }

  // Delete artist (CASCADE removes album_artists rows)
  const { error: deleteError } = await supabase
    .from("artists")
    .delete()
    .eq("id", artistId);

  if (deleteError) {
    return { ok: false, error: "Failed to delete artist from database" };
  }

  // Best-effort: remove the profile image from storage
  if (artist.image_url) {
    await supabase.storage.from("images").remove([artist.image_url]);
  }

  return { ok: true };
};

export default deleteArtist;
