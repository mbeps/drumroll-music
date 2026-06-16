import type { Album } from "@/types/album/album";
import type { AlbumDetail } from "@/types/music/album-detail";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import type { Database } from "@/types/database/types_db";
import { mapArtistRow } from "./artist";
import { mapSongRow } from "./song";

type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];
type SongRow = Database["public"]["Tables"]["songs"]["Row"];

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
