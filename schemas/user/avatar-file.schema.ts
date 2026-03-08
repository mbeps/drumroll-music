import { z } from "zod";

import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_SIZE_BYTES } from "./avatar-constants";

/**
 * Client-side schema that validates an avatar `File` instance.
 * Rejects files whose MIME type is not in {@link AVATAR_ALLOWED_TYPES} or whose size exceeds
 * {@link AVATAR_MAX_SIZE_BYTES}. Uses `z.instanceof(File)` so it cannot run in a server context.
 *
 * @author Maruf Bepary
 */
export const AvatarFileSchema = z
  .instanceof(File)
  .refine(
    (f) => AVATAR_ALLOWED_TYPES.includes(f.type as (typeof AVATAR_ALLOWED_TYPES)[number]),
    { message: "Only JPEG, PNG, WebP, or GIF files are allowed" }
  )
  .refine((f) => f.size <= AVATAR_MAX_SIZE_BYTES, {
    message: "Avatar must be 5 MB or smaller",
  });
