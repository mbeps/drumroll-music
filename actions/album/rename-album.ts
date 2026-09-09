/**
 * Server action to rename an album owned by the authenticated user.
 * Verifies ownership before updating; RLS enforces uploader_id constraint.
 *
 * @module actions/album/rename-album
 * @author Maruf Bepary
 */
"use server";

import { getLogger } from "@/lib/logger";
import { RenameAlbumSchema } from "@/schemas/albums/rename-album.schema";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "album"]);

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
const renameAlbum = async (albumId: string, newTitle: string): Promise<boolean> => {
  const parsed = RenameAlbumSchema.safeParse({ albumId, newTitle });
  if (!parsed.success) {
    logger.warn("Invalid input for renaming album: {albumId}", { albumId });
    return false;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to rename album: {albumId}", { albumId });
    return false;
  }

  const { error } = await supabase
    .from("albums")
    .update({ title: parsed.data.newTitle })
    .eq("id", parsed.data.albumId)
    .eq("uploader_id", user.id);

  if (error) {
    logger.error("Failed to rename album {albumId}: {message}", {
      albumId: parsed.data.albumId,
      message: error.message,
    });
    return false;
  }

  logger.info("Successfully renamed album: {albumId}", { albumId: parsed.data.albumId });
  return true;
};

export default renameAlbum;
