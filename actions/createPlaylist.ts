import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "../types/playlist";
import { mapPlaylistRow } from "@/lib/mappers";

/**
 * Creates a new custom playlist for the currently authenticated user.
 * Requires user authentication via Supabase Auth.
 * Returns the mapped playlist object with database defaults (UUID, timestamps).
 *
 * @param title - The title of the new playlist (should be pre-trimmed)
 * @returns Mapped Playlist object on success, null if user is not authenticated or creation fails
 * @throws No exceptions thrown; returns null on error
 * @author Maruf Bepary
 */
const createPlaylist = async (title: string): Promise<Playlist | null> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data, error: insertError } = await supabase
    .from("playlists")
    .insert({ user_id: user.id, title, is_favourites: false })
    .select("*")
    .single();

  if (insertError || !data) return null;
  return mapPlaylistRow(data);
};

export default createPlaylist;
