/**
 * Server action to rename an artist owned by the authenticated user.
 * Verifies ownership before updating; RLS enforces uploader_id constraint.
 *
 * @module actions/artist/rename-artist
 * @author Maruf Bepary
 */
"use server";

import { hasPermission } from "@/lib/auth/permissions";
import { getLogger } from "@/lib/logger";
import { RenameArtistSchema } from "@/schemas/artist/rename-artist.schema";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "artist"]);

/**
 * Renames an artist owned by the currently authenticated user.
 * Verifies ownership via uploader_id before applying the update.
 *
 * @param artistId - UUID of the artist to rename
 * @param newName - New artist name (should be pre-trimmed by caller)
 * @returns true on success, false on validation, authentication, ownership, or database error
 * @throws ValidationError if artistId or newName is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the artist
 * @see renameAlbum for similar album rename pattern
 * @author Maruf Bepary
 */
const renameArtist = async (artistId: string, newName: string): Promise<boolean> => {
  const parsed = RenameArtistSchema.safeParse({ artistId, newName });
  if (!parsed.success) {
    logger.warn("Invalid input for renaming artist: {artistId}", { artistId });
    return false;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to rename artist: {artistId}", { artistId });
    return false;
  }

  const { data: artist, error: fetchError } = await supabase
    .from("artists")
    .select("uploader_id")
    .eq("id", parsed.data.artistId)
    .maybeSingle();

  if (fetchError || !artist) {
    logger.warn("Artist {artistId} not found or error fetching", {
      artistId: parsed.data.artistId,
    });
    return false;
  }

  if (!hasPermission(user, "artists", "update", { uploaderId: artist.uploader_id })) {
    logger.warn("Unauthorized attempt to rename artist {artistId} (insufficient permissions)", {
      artistId: parsed.data.artistId,
    });
    return false;
  }

  const { error } = await supabase
    .from("artists")
    .update({ name: parsed.data.newName })
    .eq("id", parsed.data.artistId);

  if (error) {
    logger.error("Failed to rename artist {artistId}: {message}", {
      artistId: parsed.data.artistId,
      message: error.message,
    });
    return false;
  }

  logger.info("Successfully renamed artist: {artistId}", { artistId: parsed.data.artistId });
  return true;
};

export default renameArtist;
