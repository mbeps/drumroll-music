/**
 * Represents a user-owned playlist or favourites collection in the system.
 * Maps to the `public.playlists` database table with domain-level naming conventions.
 * Stores metadata only; associated songs are fetched separately via junction table.
 * @interface Playlist
 * @property {string} id - Unique identifier (UUID) for the playlist
 * @property {string} userId - UUID of the user who owns the playlist
 * @property {string} title - Display name of the playlist
 * @property {boolean} isFavourites - Flag indicating if this is the user's favourites playlist
 * @property {string | null} createdAt - ISO timestamp when playlist was created
 * @example
 * const playlist: Playlist = {
 *   id: "770e8400-e29b-41d4-a716-446655440002",
 *   userId: "user-456",
 *   title: "Workout Hits",
 *   isFavourites: false,
 *   createdAt: "2025-01-20T14:22:00Z"
 * };
 */
export interface Playlist {
  id: string;
  userId: string;
  title: string;
  isFavourites: boolean;
  createdAt: string | null;
}
