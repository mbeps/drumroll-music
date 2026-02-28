"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Renames an artist owned by the currently authenticated user.
 *
 * @param artistId - ID of the artist to rename
 * @param newName - The new name for the artist (should be pre-trimmed)
 * @returns true on success, false otherwise
 */
const renameArtist = async (
  artistId: string,
  newName: string
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("artists")
    .update({ name: newName })
    .eq("id", artistId)
    .eq("uploader_id", user.id);

  return !error;
};

export default renameArtist;
