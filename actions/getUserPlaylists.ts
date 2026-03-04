import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "@/types/types";
import { mapPlaylistRow } from "@/lib/mappers";

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

  if (queryError) console.log(queryError.message);
  return (data ?? []).map(mapPlaylistRow);
};

export default getUserPlaylists;
