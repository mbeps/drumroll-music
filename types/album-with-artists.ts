import type { Album } from "./album";
import type { Artist } from "./artist";

/**
 * Album extended with the array of credited artists.
 * Extends the base Album type with artist attribution.
 * Used across album listings, detail pages, and song cards for full context.
 * @interface AlbumWithArtists
 * @extends Album
 * @property {Artist[]} artists - Array of Artist objects credited on this release
 * @example
 * const album: AlbumWithArtists = {
 *   id: "660e8400-e29b-41d4-a716-446655440001",
 *   title: "The Rise and Fall of Ziggy Stardust",
 *   albumType: "album",
 *   releaseDate: "1972-06-16",
 *   coverImagePath: "albums/ziggy.jpg",
 *   uploaderId: "user-456",
 *   createdAt: "2025-01-15T10:30:00Z",
 *   artists: [
 *     {
 *       id: "550e8400-e29b-41d4-a716-446655440000",
 *       name: "David Bowie",
 *       imageUrl: "https://storage.example.com/artists/bowie.jpg",
 *       uploaderId: "user-456"
 *     }
 *   ]
 * };
 */
export interface AlbumWithArtists extends Album {
  artists: Artist[];
}
