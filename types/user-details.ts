/**
 * App-level profile for a user stored in `public.users`.
 * Separate from `auth.users` — holds display metadata, not authentication data.
 *
 * @author Maruf Bepary
 */
export interface UserDetails {
  id: string;
  /** User's chosen display name. */
  full_name?: string | null;
  /** Storage path within the `images` bucket (not a full URL, despite the field name). */
  avatar_url?: string | null;
  createdAt: string | null;
}
