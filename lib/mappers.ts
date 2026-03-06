import type { Album } from "../types/album";
import type { AlbumDetail } from "../types/album-detail";
import type { AlbumWithArtists } from "../types/album-with-artists";
import type { Artist } from "../types/artist";
import type { ArtistWithAlbums } from "../types/artist-with-albums";
import type { Playlist } from "../types/playlist";
import type { PlaylistWithSongs } from "../types/playlist-with-songs";
import type { Song } from "../types/song";
import type { SongWithAlbum } from "../types/song-with-album";
import type { Database } from "@/types/types_db";

type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];
type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type SongRow = Database["public"]["Tables"]["songs"]["Row"];
type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];

/**
 * Transforms a raw database artist row into a domain Artist object.
 * Use this to ensure consistent artist data structure across the application.
 * Decouples the frontend from Supabase's internal snake_case column names.
 *
 * @param row - The raw artist record from the database.
 * @returns A structured Artist object with camelCase properties.
 * @see mapArtistWithAlbumsRow for mapping artists with their associated albums.
 * @author Maruf Bepary
 */
export const mapArtistRow = (row: ArtistRow): Artist => ({
  id: row.id,
  name: row.name,
  imageUrl: row.image_url,
  uploaderId: row.uploader_id ?? null,
});

/**
 * Transforms a raw database album row into a domain Album object.
 * Use this for basic album metadata display where artist details are not required.
 * This mapper does not include nested artist information.
 *
 * @param row - The raw album record from the database.
 * @returns A structured Album object with camelCase properties.
 * @see mapAlbumWithArtistsRow for mapping albums with their associated artists.
 * @author Maruf Bepary
 */
export const mapAlbumRow = (row: AlbumRow): Album => ({
  id: row.id,
  title: row.title,
  releaseDate: row.release_date,
  coverImagePath: row.cover_image_path,
  uploaderId: row.uploader_id,
  createdAt: row.created_at,
});

/**
 * Transforms an album row with nested artist data into a domain AlbumWithArtists object.
 * Use this for album cards or lists where both album and artist names are displayed.
 * Expects a specific Supabase join structure for album_artists.
 *
 * @param row - The raw album record with nested album_artists and artists.
 * @returns A structured AlbumWithArtists object.
 * @see mapAlbumRow for the base album mapping.
 * @author Maruf Bepary
 */
export const mapAlbumWithArtistsRow = (
  row: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> }
): AlbumWithArtists => ({
  ...mapAlbumRow(row),
  artists: (row.album_artists ?? []).map((aa) => mapArtistRow(aa.artists)),
});

/**
 * Transforms a raw database song row into a domain Song object.
 * Use this for simple song lists where parent album details are not immediately needed.
 * This mapper provides basic track metadata like title and track number.
 *
 * @param row - The raw song record from the database.
 * @returns A structured Song object.
 * @see mapSongWithAlbumRow for mapping songs with their parent album data.
 * @author Maruf Bepary
 */
export const mapSongRow = (row: SongRow): Song => ({
  id: row.id,
  title: row.title,
  albumId: row.album_id,
  trackNumber: row.track_number,
  songPath: row.song_path,
  uploaderId: row.uploader_id,
  createdAt: row.created_at,
});

/**
 * Transforms a song row with nested album and artist data into a domain SongWithAlbum object.
 * Use this for the global player or search results where full context is required.
 * Handles the deep nesting of artists within the parent album.
 *
 * @param row - The raw song record with nested album and artist joins.
 * @returns A structured SongWithAlbum object.
 * @see mapSongRow for the base song mapping.
 * @author Maruf Bepary
 */
export const mapSongWithAlbumRow = (
  row: SongRow & { albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } }
): SongWithAlbum => ({
  ...mapSongRow(row),
  album: mapAlbumWithArtistsRow(row.albums),
});

/**
 * Transforms an album row with its full hierarchy into a domain AlbumDetail object.
 * Use this for the dedicated album page where tracklists and artist info are both shown.
 * Combines album metadata, artists, and all associated songs.
 *
 * @param row - The full album record including artists and songs collections.
 * @returns A structured AlbumDetail object for complete page rendering.
 * @see mapAlbumWithArtistsRow for partial album mapping.
 * @author Maruf Bepary
 */
export const mapAlbumDetailRow = (
  row: AlbumRow & {
    album_artists: Array<{ artists: ArtistRow }>;
    songs: SongRow[];
  }
): AlbumDetail => ({
  ...mapAlbumWithArtistsRow(row),
  songs: (row.songs ?? []).map(mapSongRow),
});

/**
 * Transforms an artist row with its associated albums and their artists into a domain object.
 * Use this for artist profile pages to show their discography.
 * Recursively maps nested albums and their contributing artists.
 *
 * @param row - The artist record with nested album and artist relations.
 * @returns A structured ArtistWithAlbums object.
 * @see mapArtistRow for basic artist mapping.
 * @author Maruf Bepary
 */
export const mapArtistWithAlbumsRow = (
  row: ArtistRow & {
    album_artists: Array<{ albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } }>;
  }
): ArtistWithAlbums => ({
  ...mapArtistRow(row),
  albums: (row.album_artists ?? []).map((aa) => mapAlbumWithArtistsRow(aa.albums)),
});

/**
 * Converts an AlbumDetail into an array of SongWithAlbum objects, sorted by track number.
 * Use this to prepare an album's tracklist for the global player queue.
 * Reconstructs the album context for each individual song.
 *
 * @param album - The complete album detail object.
 * @returns An array of songs with their parent album metadata attached.
 * @see mapAlbumDetailRow for fetching the initial detail object.
 * @author Maruf Bepary
 */
export const toSongsWithAlbum = (album: AlbumDetail): SongWithAlbum[] =>
  [...album.songs]
    .sort((a, b) => a.trackNumber - b.trackNumber)
    .map((song) => ({
      ...song,
      album: {
        id: album.id,
        title: album.title,
        albumType: album.albumType,
        releaseDate: album.releaseDate,
        coverImagePath: album.coverImagePath,
        uploaderId: album.uploaderId,
        createdAt: album.createdAt,
        artists: album.artists,
      },
    }));

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
