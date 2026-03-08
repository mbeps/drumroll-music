import { z } from "zod";

/**
 * Validates the payload required to update an album's cover image.
 * Requires both a valid album UUID and a non-empty storage path for the new image.
 *
 * @author Maruf Bepary
 */
export const UpdateAlbumImageSchema = z.object({
  albumId: z.uuid({ error: "Invalid album ID" }),
  imagePath: z.string().min(1, { error: "Image path is required" }),
});
