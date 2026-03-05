import type { Song } from "./song";
import type { AlbumWithArtists } from "./album-with-artists";

/**
 * Song extended with its complete album information including artists.
 * Extends the base Song type with full album context and artist attribution.
 * Used in playlists, search results, and queue displays for complete track metadata.
 * @interface SongWithAlbum
 * @extends Song
 * @property {AlbumWithArtists} album - Complete album data including credited artists
 * @example
 * const song: SongWithAlbum = {
 *   id: 1,
 *   title: "Moonage Daydream",
 *   albumId: "660e8400-e29b-41d4-a716-446655440001",
 *   trackNumber: 1,
 *   songPath: "songs/moonage_daydream.mp3",
 *   uploaderId: "user-456",
 *   createdAt: "2025-01-15T10:30:00Z",
 *   album: {
 *     id: "660e8400-e29b-41d4-a716-446655440001",
 *     title: "The Rise and Fall of Ziggy Stardust",
 *     releaseDate: "1972-06-16",
 *     coverImagePath: "albums/ziggy.jpg",
 *     uploaderId: "user-456",
 *     createdAt: "2025-01-15T10:30:00Z",
 *     artists: [
 *       {
 *         id: "550e8400-e29b-41d4-a716-446655440000",
 *         name: "David Bowie",
 *         imageUrl: "https://storage.example.com/artists/bowie.jpg",
 *         uploaderId: "user-456"
 *       }
 *     ]
 *   }
 * };
 */
export interface SongWithAlbum extends Song {
  album: AlbumWithArtists;
}
