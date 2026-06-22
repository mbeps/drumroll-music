/**
 * Server action to fetch all songs uploaded by the authenticated user.
 * Ordered by creation date (newest first).
 * Requires user authentication via Supabase Auth.
 *
 * @module actions/song/get-songs-by-user-id
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import { mapSongWithAlbumRow } from "@/lib/mappers/song";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_db-selects";

/**
 * Fetches all songs uploaded by the currently authenticated user, ordered by creation date descending.
 * Used by user profile/dashboard to display the user's uploaded music library.
 * Returns empty array if user is not authenticated.
 *
 * @returns Array of SongWithAlbum objects uploaded by the user newest first, or empty array on authentication failure
 * @throws No exceptions thrown; returns empty array on authentication failure
 * @see getSongs for fetching all public songs
 * @see getSongsByTitle for searching songs by title
 * @author Maruf Bepary
 */
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
