/**
 * Server action to fetch all custom playlists owned by the authenticated user.
 * Excludes the favourites playlist. Ordered by creation date (newest first).
 * Requires user authentication via Supabase Auth.
 *
 * @module actions/playlist/get-playlists
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { Playlist } from "@/types/playlist/playlist";
import { mapPlaylistRow } from "@/lib/mappers/playlist";

const logger = getLogger(["app", "actions", "playlist"]);

/**
 * Fetches all custom playlists (excluding the favourites playlist) owned by the currently authenticated user.
 * Ordered by creation date descending (newest first).
 * Returns empty array if user is not authenticated.
 *
 * @returns Array of Playlist objects for custom playlists, or empty array on authentication failure
 * @throws No exceptions thrown; returns empty array on authentication failure
 * @see getUserPlaylists for fetching all playlists including favourites
 * @see createPlaylist for creating a new playlist
 * @author Maruf Bepary
 */
const getPlaylists = async (): Promise<Playlist[]> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    logger.error("Authentication failed or user not found: {message}", {
      message: error?.message ?? "Not authenticated",
    });
    return [];
  }

  const { data, error: queryError } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_favourites", false)
    .order("created_at", { ascending: false });

  if (queryError) {
    logger.error("Failed to fetch custom playlists: {message}", { message: queryError.message });
  }

  return (data ?? []).map(mapPlaylistRow);
};

export default getPlaylists;
