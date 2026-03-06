import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "../types/playlist";
import { mapPlaylistRow } from "@/lib/mappers";

/**
 * Fetches the favourites playlist metadata for the currently authenticated user.
 * Returns the playlist object without songs (use getFavouriteSongs for song data).
 * Requires user authentication via Supabase Auth.
 *
 * @returns Mapped Playlist object for the user's favourites, or null if user is not authenticated or playlist not found
 * @throws No exceptions thrown; returns null on error
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
