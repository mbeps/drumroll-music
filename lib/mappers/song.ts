import type { AlbumDetail } from "@/types/album-detail";
import type { Song } from "@/types/song";
import type { SongWithAlbum } from "@/types/song-with-album";
import type { Database } from "@/types/types_db";
import { mapAlbumWithArtistsRow } from "./album";

type SongRow = Database["public"]["Tables"]["songs"]["Row"];
type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

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
