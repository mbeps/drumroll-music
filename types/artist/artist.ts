/**
 * Represents a music artist or creator in the system.
 * Maps to the `public.artists` database table with domain-level naming conventions.
 * @interface Artist
 * @property {string} id - Unique identifier (UUID) for the artist
 * @property {string} name - Display name of the artist
 * @property {string | null} imageUrl - URL to artist's profile image or album artwork
 * @property {string | null} uploaderId - Supabase auth UID of the artist creator (owner)
 * @example
 * const artist: Artist = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   name: "David Bowie",
 *   imageUrl: "https://storage.example.com/artists/bowie.jpg",
 *   uploaderId: "user-123"
 * };
 */
export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  uploaderId: string | null;
}
