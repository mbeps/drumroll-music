import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "@/types/types";
import { mapPlaylistRow } from "@/lib/mappers";

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
