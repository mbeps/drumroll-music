import type { AlbumWithArtists } from "./album-with-artists";
import type { Song } from "./song";

/**
 * Complete album information including artists and all tracks.
 * Extends AlbumWithArtists with the complete track listing for the release.
 * Provides the most comprehensive album view, used primarily on album detail pages.
 * Songs are listed in track order as stored in the database.
 * @interface AlbumDetail
 * @extends AlbumWithArtists
 * @property {Song[]} songs - Ordered array of all tracks on this album/release
 * @example
 * const albumDetail: AlbumDetail = {
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
 *   ],
 *   songs: [
 *     {
 *       id: 1,
 *       title: "Five Years",
 *       albumId: "660e8400-e29b-41d4-a716-446655440001",
 *       trackNumber: 1,
 *       songPath: "songs/five_years.mp3",
 *       uploaderId: "user-456",
 *       createdAt: "2025-01-15T10:30:00Z"
 *     }
 *   ]
 * };
 */
export interface AlbumDetail extends AlbumWithArtists {
  songs: Song[];
}
