import { z } from "zod";

/**
 * Album cover image update validation for metadata and storage management.
 * Validates the album ID and the Supabase Storage path after file upload completes.
 *
 * @author Maruf Bepary
 */

/**
 * Validates the payload required to update an album's cover image.
 * Requires both a valid album UUID and a non-empty storage path for the new image in Supabase Storage.
 * Failures: invalid UUID triggers "Invalid album ID"; empty path triggers "Image path is required";
 * server verifies user ownership before allowing the update.
 */
export const UpdateAlbumImageSchema = z.object({
  albumId: z.uuid({ message: "Invalid album ID" }),
  imagePath: z.string().min(1, { message: "Image path is required" }),
});

/** Inferred input type for {@link UpdateAlbumImageSchema}. */
export type UpdateAlbumImageInput = z.infer<typeof UpdateAlbumImageSchema>;
