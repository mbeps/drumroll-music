import type { AlbumType } from "./album-type";

/**
 * Represents a music album, single, or EP release in the system.
 * Maps to the `public.albums` database table with domain-level naming conventions.
 * Contains metadata about the release; associated artists are fetched separately.
 * @interface Album
 * @property {string} id - Unique identifier (UUID) for the album
 * @property {string} title - Album title or release name
 * @property {AlbumType} [albumType] - Optional classification (album, single, ep)
 * @property {string | null} releaseDate - ISO date string of release, null if unreleased
 * @property {string | null} coverImagePath - Storage path to album cover image
 * @property {string} uploaderId - Supabase auth UID of the album creator (owner)
 * @property {string | null} createdAt - ISO timestamp when added to database
 * @example
 * const album: Album = {
 *   id: "660e8400-e29b-41d4-a716-446655440001",
 *   title: "The Rise and Fall of Ziggy Stardust",
 *   albumType: "album",
 *   releaseDate: "1972-06-16",
 *   coverImagePath: "albums/ziggy.jpg",
 *   uploaderId: "user-456",
 *   createdAt: "2025-01-15T10:30:00Z"
 * };
 */
export interface Album {
  id: string;
  title: string;
  albumType?: AlbumType;
  releaseDate: string | null;
  coverImagePath: string | null;
  uploaderId: string;
  createdAt: string | null;
}
