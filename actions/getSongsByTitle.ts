import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "../types/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import getSongs from "@/actions/getSongs";

/**
 * Searches for songs by title using case-insensitive pattern matching.
 * Falls back to fetching all songs if the search title is empty.
 * Uses PostgREST .ilike() for case-insensitive substring matching.
 *
 * @param title - Song title to search for (case-insensitive, can be partial)
 * @returns Array of matching SongWithAlbum objects sorted by creation date, or all songs if title is empty
 * @throws No exceptions thrown; returns empty array on error
 * @author Maruf Bepary
 */
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
