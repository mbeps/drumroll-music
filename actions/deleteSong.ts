import { createServerSupabaseClient } from "@/utils/supabase/server";
import { DeleteSongSchema } from "@/schemas/songs/delete-song.schema";

/**
 * Deletes a song owned by the currently authenticated user.
 * Verifies ownership before deleting. The DB CASCADE removes playlist_songs rows.
 * Also removes the audio file from storage.
 *
 * @param songId - ID of the song to delete
 * @returns true on success, false otherwise
 * @author Maruf Bepary
 */
const deleteSong = async (songId: number): Promise<boolean> => {
  const parsed = DeleteSongSchema.safeParse({ songId });
  if (!parsed.success) return false;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Fetch the song to verify ownership and get the storage path
  const { data: song, error: fetchError } = await supabase
    .from("songs")
    .select("song_path, uploader_id")
    .eq("id", songId)
    .maybeSingle();

  if (fetchError || !song) return false;
  if (song.uploader_id !== user.id) return false;

  // Delete the song record (CASCADE removes playlist_songs)
  const { error: deleteError } = await supabase
    .from("songs")
    .delete()
    .eq("id", songId);

  if (deleteError) return false;

  // Best-effort: remove the audio file from storage
  await supabase.storage.from("songs").remove([song.song_path]);

  return true;
};

export default deleteSong;
