import { z } from "zod";

/**
 * Validates input for updating an artist's profile image path in the database.
 * Requires a valid UUID artistId and a non-empty Supabase Storage path.
 *
 * @see ArtistImageFileSchema for client-side file validation before upload
 * @author Maruf Bepary
 */
export const UpdateArtistImageSchema = z.object({
  artistId: z.uuid({ error: "Invalid artist ID" }),
  imagePath: z.string().min(1, { error: "Image path is required" }),
});
