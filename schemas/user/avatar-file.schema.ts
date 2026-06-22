import { z } from "zod";

import { FILE_LIMITS } from "@/lib/env";
import { AVATAR_ALLOWED_TYPES } from "./avatar-constants";

/**
 * User profile avatar file validation for browser-side uploads.
 * Validates file type and size before transmission to Supabase Storage; enforces 5 MB limit per `FILE_LIMITS.AVATAR_MAX_BYTES`.
 *
 * @see AVATAR_ALLOWED_TYPES for permitted image formats
 * @author Maruf Bepary
 */

/**
 * Client-side schema that validates an avatar `File` instance.
 * Uses `z.instanceof(File)` so it cannot run in a server context; checks MIME type against {@link AVATAR_ALLOWED_TYPES}
 * and file size against the limit defined in `FILE_LIMITS.AVATAR_MAX_BYTES` (5 MB default).
 * Failures: invalid MIME type triggers "Only JPEG, PNG, WebP, or GIF files are allowed";
 * oversized file triggers "Avatar must be 5 MB or smaller".
 */
export const AvatarFileSchema = z
  .instanceof(File)
  .refine(
    (f) => AVATAR_ALLOWED_TYPES.includes(f.type as (typeof AVATAR_ALLOWED_TYPES)[number]),
    { message: "Only JPEG, PNG, WebP, or GIF files are allowed" }
  )
  .refine((f) => f.size <= FILE_LIMITS.AVATAR_MAX_BYTES, {
    message: "Avatar must be 5 MB or smaller",
  });
