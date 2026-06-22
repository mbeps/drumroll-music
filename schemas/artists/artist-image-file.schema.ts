import { z } from "zod";
import { FILE_LIMITS } from "@/lib/env";

/**
 * Artist profile image file validation for browser-side uploads.
 * Validates file type and size before transmission to Supabase Storage; enforces 2 MB limit per `FILE_LIMITS.ARTIST_IMAGE_MAX_BYTES`.
 *
 * @author Maruf Bepary
 */

/**
 * Client-side schema for validating an artist profile image File before upload.
 * Accepts any image MIME type with a maximum size of 2 MB (`FILE_LIMITS.ARTIST_IMAGE_MAX_BYTES`).
 * Uses `z.instanceof(File)` — browser-only, not safe for server-side use.
 * Failures: non-image MIME type triggers "Only image files are allowed for artist profile";
 * oversized file triggers "Artist image must be less than 2 MB".
 */
export const ArtistImageFileSchema = z
  .instanceof(File)
  .refine((f) => f.type.startsWith("image/"), {
    message: "Only image files are allowed for artist profile",
  })
  .refine((f) => f.size <= FILE_LIMITS.ARTIST_IMAGE_MAX_BYTES, {
    message: "Artist image must be less than 2 MB",
  });
