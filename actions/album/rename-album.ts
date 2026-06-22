/**
 * Server action to rename an album owned by the authenticated user.
 * Verifies ownership before updating; RLS enforces uploader_id constraint.
 *
 * @module actions/album/rename-album
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { RenameAlbumSchema } from "@/schemas/albums/rename-album.schema";

/**
 * Renames an album owned by the currently authenticated user.
 * Verifies ownership via uploader_id before applying the update.
 *
 * @param albumId - UUID of the album to rename
 * @param newTitle - New album title (should be pre-trimmed by caller)
 * @returns true on success, false on validation, authentication, ownership, or database error
 * @throws ValidationError if albumId or newTitle is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the album
 * @see renamePlaylist for similar entity rename pattern
 * @see renameArtist for similar artist rename
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
