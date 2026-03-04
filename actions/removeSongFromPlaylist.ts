import { createServerSupabaseClient } from "@/utils/supabase/server";

const removeSongFromPlaylist = async (
  playlistId: string,
  songId: number
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  return !error;
};

export default removeSongFromPlaylist;
