"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteAlbumSchema } from "@/schemas/albums/delete-album.schema";

/**
 * Deletes an album owned by the currently authenticated user.
 * The DB CASCADE removes album_artists, songs, and playlist_songs rows.
 * Also best-effort removes the cover image from storage.
 *
 * @param albumId - ID of the album to delete
 * @returns { ok: boolean, error?: string } on success/failure
 * @author Maruf Bepary
 */
const deleteAlbum = async (
  albumId: string
): Promise<{ ok: boolean; error?: string }> => {
  const parsed = DeleteAlbumSchema.safeParse({ albumId });
  if (!parsed.success) {
    return { ok: false, error: "Invalid album ID" };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Authenticated user not found" };
  }

  // Fetch album to verify ownership and get the cover image path
  const { data: album, error: fetchError } = await supabase
    .from("albums")
    .select("cover_image_path, uploader_id")
    .eq("id", albumId)
    .maybeSingle();

  if (fetchError || !album) {
    return { ok: false, error: "Album not found or error fetching album" };
  }

  if (album.uploader_id !== user.id) {
    return { ok: false, error: "You do not have permission to delete this album" };
  }

  // Delete album (CASCADE removes album_artists, songs, and playlist_songs)
  const { error: deleteError } = await supabase
    .from("albums")
    .delete()
    .eq("id", albumId);

  if (deleteError) {
    return { ok: false, error: "Failed to delete album from database" };
  }

  // Best-effort: remove the cover image from storage
  if (album.cover_image_path) {
    await supabase.storage.from("images").remove([album.cover_image_path]);
  }

  return { ok: true };
};

export default deleteAlbum;
