import type { UserDetails } from "@/types/user/user-details";

/**
 * Extended user profile combining `public.users` data with Supabase auth metadata.
 * Used by the account page to display and conditionally render settings panels.
 *
 * @author Maruf Bepary
 */
export type UserProfile = UserDetails & {
  /** The user's email address sourced from `auth.users`. */
  email: string;
  /** OAuth provider identifier (e.g. `'email'`, `'github'`, `'google'`). */
  provider: string;
  /** True when the account has an email/password identity and may update the password. */
  canChangePassword: boolean;
};
