import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "../types/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";

/**
 * Fetches all songs with album information, ordered by newest first.
 * Uses SONG_WITH_ALBUM_SELECT PostgREST JOIN for efficient data loading.
 * Returns empty array if query fails.
 *
 * @returns Array of SongWithAlbum objects sorted by creation date (newest first), or empty array on error
 * @throws No exceptions thrown; returns empty array on error
 * @author Maruf Bepary
 */
const getSongs = async (): Promise<SongWithAlbum[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select(SONG_WITH_ALBUM_SELECT)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapSongWithAlbumRow);
};

export default getSongs;
