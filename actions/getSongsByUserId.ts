import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "../types/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";

const getSongsByUserId = async (): Promise<SongWithAlbum[]> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log(error?.message ?? "Not authenticated");
    return [];
  }

  const { data, error: queryError } = await supabase
    .from("songs")
    .select(SONG_WITH_ALBUM_SELECT)
    .eq("uploader_id", user.id)
    .order("created_at", { ascending: false });

  if (queryError) console.log(queryError.message);
  return (data ?? []).map(mapSongWithAlbumRow);
};

export default getSongsByUserId;
