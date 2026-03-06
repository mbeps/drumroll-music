/**
 * Represents user profile information stored in the public schema.
 * Maps to the `public.users` table (app profile, separate from auth.users).
 * Provides non-sensitive user metadata for display and personalization.
 * @interface UserDetails
 * @property {string} id - Supabase auth UID (UUID) linking to auth.users
 * @property {string | null} [full_name] - User's display name, optional
 * @property {string | null} [avatar_url] - URL to user's profile picture, optional
 * @example
 * const user: UserDetails = {
 *   id: "user-456",
 *   full_name: "Maruf Bepary",
 *   avatar_url: "https://storage.example.com/avatars/maruf.jpg"
 * };
 */
export interface UserDetails {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
}
