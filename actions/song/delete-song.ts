/**
 * Server action to delete a song owned by the authenticated user.
 * Cascades to remove playlist associations (playlist_songs rows).
 * Best-effort removes the audio file from storage. RLS enforces ownership via uploader_id.
 *
 * @module actions/song/delete-song
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteSongSchema } from "@/schemas/songs/delete-song.schema";

/**
 * Deletes a song owned by the currently authenticated user.
 * Verifies ownership before deletion; cascading database constraints remove playlist_songs rows.
 * Best-effort removes the audio file from the 'songs' storage bucket.
 *
 * @param songId - ID of the song to delete
 * @returns Object with `ok: true` on success or `ok: false` with descriptive `error` string on failure
 * @throws ValidationError if songId is invalid
 * @throws UnauthorizedError if user is not authenticated or does not own the song
 * @throws DatabaseError if song record not found or database operation fails
 * @see deleteAlbum for similar entity deletion pattern
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
