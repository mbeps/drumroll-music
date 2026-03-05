import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "../types/playlist";
import { mapPlaylistRow } from "@/lib/mappers";

/**
 * Fetches all custom playlists (excluding the favourites playlist) owned by the currently authenticated user.
 * Ordered by creation date, newest first.
 * Requires user authentication via Supabase Auth.
 *
 * @returns Array of Playlist objects for custom playlists, or empty array if user is not authenticated
 * @throws No exceptions thrown; returns empty array on authentication failure
 * @author Maruf Bepary
 */
const getPlaylists = async (): Promise<Playlist[]> => {
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
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_favourites", false)
    .order("created_at", { ascending: false });

  if (queryError) console.log(queryError.message);
  return (data ?? []).map(mapPlaylistRow);
};

export default getPlaylists;
