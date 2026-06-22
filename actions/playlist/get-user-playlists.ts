/**
 * Server action to fetch all playlists owned by the authenticated user.
 * Includes the favourites playlist. Ordered by creation date (newest first).
 * Requires user authentication via Supabase Auth.
 *
 * @module actions/playlist/get-user-playlists
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { Playlist } from "@/types/playlist/playlist";
import { mapPlaylistRow } from "@/lib/mappers/playlist";

const logger = getLogger(["app", "actions", "playlist"]);

/**
 * Fetches all playlists (including the favourites playlist) owned by the currently authenticated user.
 * Ordered by creation date descending (newest first).
 * Returns empty array if user is not authenticated.
 *
 * @returns Array of all Playlist objects for the user including favourites, or empty array on authentication failure
 * @throws No exceptions thrown; returns empty array on authentication failure
 * @see getPlaylists for fetching custom playlists only (excluding favourites)
 * @see getFavouritesPlaylist for fetching just the favourites playlist
 * @author Maruf Bepary
 */
const getUserPlaylists = async (): Promise<Playlist[]> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return [];

  const { data, error: queryError } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (queryError) {
    logger.error("Failed to fetch user playlists: {message}", { message: queryError.message });
  }

  return (data ?? []).map(mapPlaylistRow);
};

export default getUserPlaylists;
