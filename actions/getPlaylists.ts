import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "../types/playlist";
import { mapPlaylistRow } from "@/lib/mappers";

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
