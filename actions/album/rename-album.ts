"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { RenameAlbumSchema } from "@/schemas/albums/rename-album.schema";

/**
 * Renames an album owned by the currently authenticated user.
 *
 * @param albumId - ID of the album to rename
 * @param newTitle - The new title for the album (should be pre-trimmed)
 * @returns true on success, false otherwise
 * @author Maruf Bepary
 */
const renameAlbum = async (
  albumId: string,
  newTitle: string
): Promise<boolean> => {
  const parsed = RenameAlbumSchema.safeParse({ albumId, newTitle });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("albums")
    .update({ title: parsed.data.newTitle })
    .eq("id", parsed.data.albumId)
    .eq("uploader_id", user.id);

  return !error;
};

export default renameAlbum;
