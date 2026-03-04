import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { PlaylistWithSongs } from "@/types/types";
import { mapPlaylistWithSongsRow } from "@/lib/mappers";
import { PLAYLIST_WITH_SONGS_SELECT } from "@/actions/_selects";

const getPlaylistById = async (id: string): Promise<PlaylistWithSongs | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("playlists")
    .select(PLAYLIST_WITH_SONGS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log(error?.message ?? "Playlist not found");
    return null;
  }

  return mapPlaylistWithSongsRow(data);
};

export default getPlaylistById;
