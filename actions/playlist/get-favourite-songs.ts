/**
 * Server action to fetch all songs in the authenticated user's favourites playlist.
 * Returns songs in their stored position order.
 * Requires user authentication via Supabase Auth.
 *
 * @module actions/playlist/get-favourite-songs
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import type { Database, PlaylistSongRow } from "@/types/database/types_db";
import { mapSongWithAlbumRow } from "@/lib/mappers/song";
import { PLAYLIST_WITH_SONGS_SELECT } from "@/actions/_db-selects";

type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
type SongRow = Database["public"]["Tables"]["songs"]["Row"];
type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type AlbumArtistRow = Database["public"]["Tables"]["album_artists"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

type SongRowWithAlbum = SongRow & {
  albums: AlbumRow & {
    album_artists: Array<AlbumArtistRow & { artists: ArtistRow }>;
  };
};

type PlaylistSongWithSongs = PlaylistSongRow & {
  songs: SongRowWithAlbum;
};

type FavouritesQueryRow = PlaylistRow & { playlist_songs: PlaylistSongWithSongs[] };

/**
 * Fetches all songs from the currently authenticated user's favourites playlist.
 * Returns songs in their stored position order within the playlist.
 * Returns empty array if user is not authenticated or favourites playlist not found.
 *
 * @returns Array of SongWithAlbum objects in position order, or empty array on authentication failure
 * @throws No exceptions thrown; returns empty array on authentication failure or query error
 * @see getFavouritesPlaylist for fetching the favourites playlist metadata
 * @see getUserPlaylists for fetching all user playlists
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
