import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Playlist } from "@/types/types";
import { mapPlaylistRow } from "@/lib/mappers";

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
