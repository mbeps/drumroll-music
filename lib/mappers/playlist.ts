/**
 * Domain mapping for playlist records at various composition levels.
 *
 * Transforms raw Supabase database rows into domain model types for playlists:
 * simple playlists and playlists with their constituent songs in order.
 * Decouples the frontend from database row structures and handles song ordering.
 *
 * @see {@link mapSongWithAlbumRow} for related song mapping dependencies
 * @author Maruf Bepary
 */

import type { Playlist } from "@/types/playlist/playlist";
import type { PlaylistWithSongs } from "@/types/playlist/playlist-with-songs";
import type { Database } from "@/types/database/types_db";
import { mapSongWithAlbumRow } from "./song";

type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
type SongRow = Database["public"]["Tables"]["songs"]["Row"];
type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

/**
 * Transforms a raw database playlist row into a domain Playlist object.
 * Use this for displaying playlist names in selectors or navigation sidebars.
 * Provides basic metadata including the "Favourites" flag.
 *
 * @param row - The raw playlist record from the database.
 * @returns A structured Playlist object.
 * @see mapPlaylistWithSongsRow for mapping a playlist with its content.
 * @author Maruf Bepary
 */
export const mapPlaylistRow = (row: PlaylistRow): Playlist => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  isFavourites: row.is_favourites,
  createdAt: row.created_at,
});

/**
 * Transforms a playlist row with its constituent songs into a PlaylistWithSongs domain object.
 * Use this for viewing the contents of a specific playlist.
 * Automatically sorts songs based on their manual position within the playlist.
 *
 * @param row - The playlist record including nested playlist_songs and song details.
 * @returns A structured PlaylistWithSongs object with ordered tracks.
 * @see mapPlaylistRow for basic playlist mapping.
 * @author Maruf Bepary
 */
export const mapPlaylistWithSongsRow = (
  row: PlaylistRow & {
    playlist_songs: Array<{
      position: number;
      songs: SongRow & { albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } };
    }>;
  }
): PlaylistWithSongs => ({
  ...mapPlaylistRow(row),
  songs: (row.playlist_songs ?? [])
    .sort((a, b) => a.position - b.position)
    .map((ps) => mapSongWithAlbumRow(ps.songs)),
});
