import { z } from "zod";
import { ARTIST_IMAGE_MAX_SIZE_BYTES } from "./artist-image-max-size";

/**
 * Client-side schema for validating an artist profile image File before upload.
 * Accepts any image MIME type with a maximum size of 2 MB.
 * Uses `z.instanceof(File)` — browser-only, not safe for server-side use.
 *
 * @see ARTIST_IMAGE_MAX_SIZE_BYTES for the size limit constant
 * @author Maruf Bepary
 */
export const ArtistImageFileSchema = z
  .instanceof(File)
  .refine((f) => f.type.startsWith("image/"), {
    message: "Only image files are allowed for artist profile",
  })
  .refine((f) => f.size <= ARTIST_IMAGE_MAX_SIZE_BYTES, {
    message: "Artist image must be less than 2 MB",
  });
