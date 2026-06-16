import type { Artist } from "@/types/artist/artist";
import type { ArtistWithAlbums } from "@/types/music/artist-with-albums";
import type { Database } from "@/types/database/types_db";
import { mapAlbumWithArtistsRow } from "./album";

type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

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
    album_artists: Array<{ albums: Database["public"]["Tables"]["albums"]["Row"] & { album_artists: Array<{ artists: ArtistRow }> } }>;
  }
): ArtistWithAlbums => ({
  ...mapArtistRow(row),
  albums: (row.album_artists ?? []).map((aa) => mapAlbumWithArtistsRow(aa.albums)),
});
