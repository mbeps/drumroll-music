import { createServerSupabaseClient } from "@/utils/supabase/server";

const addSongToPlaylist = async (
  playlistId: string,
  songId: number
): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();

  // Check if song already exists in this playlist
  const { data: existing } = await supabase
    .from("playlist_songs")
    .select("song_id")
    .eq("playlist_id", playlistId)
    .eq("song_id", songId)
    .single();

  if (existing) return false;

  // Get max position for this playlist
  const { data: maxPos } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (maxPos?.position ?? 0) + 1;

  const { error } = await supabase
    .from("playlist_songs")
    .insert({ playlist_id: playlistId, song_id: songId, position: nextPosition });

  return !error;
};

export default addSongToPlaylist;
