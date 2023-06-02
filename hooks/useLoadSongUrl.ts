import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Song } from "@/types/types";

// fetches song which will then be played
const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song) {
    return "";
  }

  const { data: songData } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  return songData.publicUrl;
};

export default useLoadSongUrl;
