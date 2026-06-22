/**
 * User profile avatar validation constants and configuration.
 * Centralizes permitted image MIME types for avatar uploads to ensure browser compatibility and security.
 *
 * @author Maruf Bepary
 */

/** MIME types permitted for user avatar uploads (JPEG, PNG, WebP, GIF) for broad browser support. */
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
