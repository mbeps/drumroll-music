import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "../types/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import getSongs from "@/actions/getSongs";

const getSongsByTitle = async (title: string): Promise<SongWithAlbum[]> => {
  if (!title) return getSongs();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select(SONG_WITH_ALBUM_SELECT)
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapSongWithAlbumRow);
};

export default getSongsByTitle;
