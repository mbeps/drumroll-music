/**
 * Server action to delete an artist owned by the authenticated user.
 * Cascades to remove album credits (album_artists rows); albums themselves are preserved.
 * Best-effort removes the profile image from storage. RLS enforces ownership via uploader_id.
 *
 * @module actions/artist/delete-artist
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteArtistSchema } from "@/schemas/artists/delete-artist.schema";

/**
 * Deletes an artist owned by the currently authenticated user.
 * Verifies ownership before deletion; cascading database constraints remove album_artists junction rows.
 * The albums themselves are not deleted; only the credit association is removed.
 * Best-effort removes the profile image from the 'images' storage bucket.
 *
 * @param artistId - UUID of the artist to delete
 * @returns Object with `ok: true` on success or `ok: false` with descriptive `error` string on failure
 * @throws ValidationError if artistId is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the artist
 * @throws DatabaseError if artist record not found or database operation fails
 * @see deleteAlbum for similar entity deletion with cascading song removal
 * @see deleteArtistImage for removing only the image without deleting the artist
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
