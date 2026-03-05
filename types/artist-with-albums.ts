import type { Artist } from "./artist";
import type { AlbumWithArtists } from "./album-with-artists";

/**
 * Artist extended with their complete discography of albums.
 * Extends the base Artist type with all their releases and compilations.
 * Used on artist detail pages to show full catalog of work.
 * @interface ArtistWithAlbums
 * @extends Artist
 * @property {AlbumWithArtists[]} albums - Array of albums/singles/EPs credited to this artist
 * @example
 * const artist: ArtistWithAlbums = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   name: "David Bowie",
 *   imageUrl: "https://storage.example.com/artists/bowie.jpg",
 *   uploaderId: "user-456",
 *   albums: [
 *     {
 *       id: "660e8400-e29b-41d4-a716-446655440001",
 *       title: "The Rise and Fall of Ziggy Stardust",
 *       releaseDate: "1972-06-16",
 *       coverImagePath: "albums/ziggy.jpg",
 *       uploaderId: "user-456",
 *       createdAt: "2025-01-15T10:30:00Z",
 *       artists: []
 *     }
 *   ]
 * };
 */
export interface ArtistWithAlbums extends Artist {
  albums: AlbumWithArtists[];
}
