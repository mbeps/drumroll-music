/** MIME types permitted for user avatar uploads (JPEG, PNG, WebP, GIF). */
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

/** Maximum allowed avatar file size in bytes (5 MB). */
export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
