/**
 * Server action to search for songs by title using case-insensitive pattern matching.
 * Falls back to getSongs() if search title is empty.
 * Public read access; no authentication required.
 *
 * @module actions/song/get-songs-by-title
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers/song";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_db-selects";
import getSongs from "@/actions/song/get-songs";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "song"]);

/**
 * Searches for songs by title using case-insensitive substring matching (ilike).
 * Empty title falls back to getSongs() to return all songs.
 * No authentication required; publicly readable via RLS.
 *
 * @param title - Song title to search (case-insensitive substring match)
 * @returns Array of matching SongWithAlbum objects newest first, or all songs if title is empty
 * @throws No exceptions thrown; returns empty array on query error
 * @see getSongs for fetching all songs without search
 * @see getSongsByUserId for fetching songs by a specific user
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

  if (error) {
    logger.error("Error searching songs by title {title}: {message}", {
      title,
      message: error.message,
    });
  }
  return (data ?? []).map(mapSongWithAlbumRow);
};

export default getSongsByTitle;
