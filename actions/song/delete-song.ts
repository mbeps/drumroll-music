"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteSongSchema } from "@/schemas/songs/delete-song.schema";

/**
 * Deletes a song owned by the currently authenticated user.
 * Verifies ownership before deleting. The DB CASCADE removes playlist_songs rows.
 * Also removes the audio file from storage.
 *
 * @param songId - ID of the song to delete
 * @returns { ok: boolean, error?: string } on success/failure
 * @author Maruf Bepary
 */
const deleteSong = async (
  songId: number
): Promise<{ ok: boolean; error?: string }> => {
  const parsed = DeleteSongSchema.safeParse({ songId });
  if (!parsed.success) {
    return { ok: false, error: "Invalid song ID" };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Authenticated user not found" };
  }

  // Fetch the song to verify ownership and get the storage path
  const { data: song, error: fetchError } = await supabase
    .from("songs")
    .select("song_path, uploader_id")
    .eq("id", songId)
    .maybeSingle();

  if (fetchError || !song) {
    return { ok: false, error: "Song not found or error fetching song" };
  }

  if (song.uploader_id !== user.id) {
    return { ok: false, error: "You do not have permission to delete this song" };
  }

  // Delete the song record (CASCADE removes playlist_songs)
  const { error: deleteError } = await supabase
    .from("songs")
    .delete()
    .eq("id", songId);

  if (deleteError) {
    return { ok: false, error: "Failed to delete song from database" };
  }

  // Best-effort: remove the audio file from storage
  await supabase.storage.from("songs").remove([song.song_path]);

  return { ok: true };
};

export default deleteSong;
