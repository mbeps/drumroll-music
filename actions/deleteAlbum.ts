"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Deletes an album owned by the currently authenticated user.
 * The DB CASCADE removes album_artists, songs, and playlist_songs rows.
 * Also best-effort removes the cover image from storage.
 *
 * @param albumId - ID of the album to delete
 * @returns true on success, false otherwise
 */
const deleteAlbum = async (albumId: string): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Fetch album to verify ownership and get the cover image path
  const { data: album, error: fetchError } = await supabase
    .from("albums")
    .select("cover_image_path, uploader_id")
    .eq("id", albumId)
    .maybeSingle();

  if (fetchError || !album) return false;
  if (album.uploader_id !== user.id) return false;

  // Delete album (CASCADE removes album_artists, songs, and playlist_songs)
  const { error: deleteError } = await supabase
    .from("albums")
    .delete()
    .eq("id", albumId);

  if (deleteError) return false;

  // Best-effort: remove the cover image from storage
  if (album.cover_image_path) {
    await supabase.storage.from("images").remove([album.cover_image_path]);
  }

  return true;
};

export default deleteAlbum;
