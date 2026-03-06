/**
 * Represents an individual music track or song in the system.
 * Maps to the `public.songs` database table with domain-level naming conventions.
 * Songs always belong to an album; album details are fetched separately.
 * @interface Song
 * @property {number} id - Unique identifier (bigint) for the song
 * @property {string} title - Display title of the track
 * @property {string} albumId - UUID referencing the parent album
 * @property {number} trackNumber - Position within the album (1-indexed)
 * @property {string} songPath - Storage path to audio file in Supabase
 * @property {string} uploaderId - Supabase auth UID of the song uploader (owner)
 * @property {string | null} createdAt - ISO timestamp when added to database
 * @example
 * const song: Song = {
 *   id: 1,
 *   title: "Moonage Daydream",
 *   albumId: "660e8400-e29b-41d4-a716-446655440001",
 *   trackNumber: 1,
 *   songPath: "songs/moonage_daydream.mp3",
 *   uploaderId: "user-456",
 *   createdAt: "2025-01-15T10:30:00Z"
 * };
 */
export interface Song {
  id: number;
  title: string;
  albumId: string;
  trackNumber: number;
  songPath: string;
  uploaderId: string;
  createdAt: string | null;
}
