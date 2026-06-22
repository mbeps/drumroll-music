/**
 * Server action to fetch all songs with album and artist information.
 * Ordered by creation date (newest first).
 * Public read access; no authentication required.
 *
 * @module actions/song/get-songs
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers/song";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_db-selects";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "song"]);

/**
 * Fetches all songs with album information, ordered by creation date descending.
 * Uses SONG_WITH_ALBUM_SELECT for efficient nested PostgREST joins.
 * No authentication required; publicly readable via RLS.
 *
 * @returns Array of SongWithAlbum objects sorted newest first, or empty array on error
 * @throws No exceptions thrown; returns empty array on query error
 * @see getSongsByTitle for searching songs by title
 * @see getSongsByUserId for fetching songs uploaded by a specific user
 * @author Maruf Bepary
 */
const getSongs = async (): Promise<SongWithAlbum[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("songs")
    .select(SONG_WITH_ALBUM_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching songs: {message}", { message: error.message });
  }
  return (data ?? []).map(mapSongWithAlbumRow);
};

export default getSongs;
