/**
 * Server action to fetch the favourites playlist metadata for the authenticated user.
 * Returns playlist object without songs (use getFavouriteSongs for song data).
 * Requires user authentication via Supabase Auth.
 *
 * @module actions/playlist/get-favourites-playlist
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "@/types/playlist/playlist";
import { mapPlaylistRow } from "@/lib/mappers/playlist";

/**
 * Fetches the favourites playlist metadata for the currently authenticated user.
 * Returns the playlist object without songs (use getFavouriteSongs for song data).
 * Returns null if user is not authenticated or favourites playlist not found.
 *
 * @returns Mapped Playlist object for the user's favourites, or null on authentication or fetch failure
 * @throws No exceptions thrown; returns null on error
 * @see getFavouriteSongs for fetching the actual songs in the favourites playlist
 * @see getUserPlaylists for fetching all user playlists including favourites
 * @author Maruf Bepary
 */
const getFavouritesPlaylist = async (): Promise<Playlist | null> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data, error: queryError } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_favourites", true)
    .single();

  if (queryError || !data) return null;
  return mapPlaylistRow(data);
};

export default getFavouritesPlaylist;
