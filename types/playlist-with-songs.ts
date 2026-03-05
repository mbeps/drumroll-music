import type { Playlist } from "./playlist";
import type { SongWithAlbum } from "./song-with-album";

/**
 * Playlist extended with its complete ordered song list.
 * Extends the base Playlist type with all tracks and their album context.
 * Used on playlist detail pages and for drag-and-drop reordering operations.
 * Songs maintain their position order as stored in the junction table.
 * @interface PlaylistWithSongs
 * @extends Playlist
 * @property {SongWithAlbum[]} songs - Ordered array of songs in this playlist with album context
 * @example
 * const playlist: PlaylistWithSongs = {
 *   id: "770e8400-e29b-41d4-a716-446655440002",
 *   userId: "user-456",
 *   title: "Workout Hits",
 *   isFavourites: false,
 *   createdAt: "2025-01-20T14:22:00Z",
 *   songs: [
 *     {
 *       id: 1,
 *       title: "Moonage Daydream",
 *       albumId: "660e8400-e29b-41d4-a716-446655440001",
 *       trackNumber: 1,
 *       songPath: "songs/moonage_daydream.mp3",
 *       uploaderId: "user-456",
 *       createdAt: "2025-01-15T10:30:00Z",
 *       album: {} as SongWithAlbum["album"]
 *     }
 *   ]
 * };
 */
export interface PlaylistWithSongs extends Playlist {
  songs: SongWithAlbum[];
}
