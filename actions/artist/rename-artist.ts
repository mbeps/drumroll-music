/**
 * Server action to rename an artist owned by the authenticated user.
 * Verifies ownership before updating; RLS enforces uploader_id constraint.
 *
 * @module actions/artist/rename-artist
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { RenameArtistSchema } from "@/schemas/artists/rename-artist.schema";

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
const renameArtist = async (
  artistId: string,
  newName: string
): Promise<boolean> => {
  const parsed = RenameArtistSchema.safeParse({ artistId, newName });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("artists")
    .update({ name: parsed.data.newName })
    .eq("id", parsed.data.artistId)
    .eq("uploader_id", user.id);

  return !error;
};

export default renameArtist;
