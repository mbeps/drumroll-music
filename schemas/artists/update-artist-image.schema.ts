import { z } from "zod";

/**
 * Artist profile image update validation for metadata and storage management.
 * Validates the artist ID and the Supabase Storage path after file upload completes.
 *
 * @see ArtistImageFileSchema for client-side file validation before upload
 * @author Maruf Bepary
 */

/**
 * Validates input for updating an artist's profile image path in the database.
 * Requires a valid UUID artistId and a non-empty Supabase Storage path for the new image.
 * Failures: invalid UUID triggers "Invalid artist ID"; empty path triggers "Image path is required";
 * server verifies user ownership before allowing the update.
 */
export const UpdateArtistImageSchema = z.object({
  artistId: z.uuid({ message: "Invalid artist ID" }),
  imagePath: z.string().min(1, { message: "Image path is required" }),
});

/** Inferred input type for {@link UpdateArtistImageSchema}. */
export type UpdateArtistImageInput = z.infer<typeof UpdateArtistImageSchema>;
