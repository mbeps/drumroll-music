import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "@/types/types";
import type { Database, PlaylistSongRow } from "@/types/types_db";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { PLAYLIST_WITH_SONGS_SELECT } from "@/actions/_selects";

type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
type FavouritesQueryRow = PlaylistRow & { playlist_songs: PlaylistSongRow[] };

const getFavouriteSongs = async (): Promise<SongWithAlbum[]> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log(error?.message ?? "Not authenticated");
    return [];
  }

  const { data } = await supabase
    .from("playlists")
    .select(PLAYLIST_WITH_SONGS_SELECT)
    .eq("user_id", user.id)
    .eq("is_favourites", true)
    .returns<FavouritesQueryRow[]>()
    .single();

  if (!data) return [];

  return (data.playlist_songs ?? [])
    .sort((a, b) => a.position - b.position)
    .flatMap((ps) => (ps.songs ? [mapSongWithAlbumRow(ps.songs)] : []));
};

export default getFavouriteSongs;
