import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "../types/song-with-album";
import type { Database, PlaylistSongRow } from "@/types/types_db";
import { mapSongWithAlbumRow } from "@/lib/mappers";
import { PLAYLIST_WITH_SONGS_SELECT } from "@/actions/_selects";

type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
type FavouritesQueryRow = PlaylistRow & { playlist_songs: PlaylistSongRow[] };

/**
 * Fetches all songs from the currently authenticated user's favourites playlist.
 * Songs are returned in their stored position order within the playlist.
 * Requires user authentication via Supabase Auth.
 *
 * @returns Array of SongWithAlbum objects in playlist position order, or empty array if user is not authenticated
 * @throws No exceptions thrown; returns empty array on authentication failure
 * @author Maruf Bepary
 */
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
