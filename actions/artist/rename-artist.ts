"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { RenameArtistSchema } from "@/schemas/artists/rename-artist.schema";

/**
 * Renames an artist owned by the currently authenticated user. Server-side only.
 * Only updates if the calling user matches the artist's uploader_id.
 *
 * @param artistId - ID of the artist to rename
 * @param newName - The new name for the artist (should be pre-trimmed)
 * @returns true on success, false otherwise
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
