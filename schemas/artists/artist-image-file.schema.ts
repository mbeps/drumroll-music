import { z } from "zod";
import { FILE_LIMITS } from "@/lib/env";

/**
 * Client-side schema for validating an artist profile image File before upload.
 * Accepts any image MIME type with a maximum size of 2 MB.
 * Uses `z.instanceof(File)` — browser-only, not safe for server-side use.
 *
 * @author Maruf Bepary
 */
export const ArtistImageFileSchema = z
  .instanceof(File)
  .refine((f) => f.type.startsWith("image/"), {
    message: "Only image files are allowed for artist profile",
  })
  .refine((f) => f.size <= FILE_LIMITS.ARTIST_IMAGE_MAX_BYTES, {
    message: "Artist image must be less than 2 MB",
  });
