import { z } from "zod";

/**
 * Artist creation validation for the multi-step song upload flow (Step 1 of 3).
 * Validates the artist name when a user chooses to create a new artist instead of selecting an existing one.
 *
 * @see NewAlbumSchema for Step 2 album selection or creation
 * @see SongUploadSchema for Step 3 song metadata validation
 * @author Maruf Bepary
 */

/**
 * Validates the artist name entered during Step 1 of the upload flow.
 * Applied when the user chooses to create a new artist rather than selecting an existing one.
 * Enforces non-empty trimmed name up to 200 characters.
 * Failures: missing name triggers "Artist name is required"; exceeding 200 chars triggers "Artist name must be 200 characters or fewer".
 */
export const NewArtistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Artist name is required" })
    .max(200, { message: "Artist name must be 200 characters or fewer" }),
});

/**
 * Inferred input type for {@link NewArtistSchema}.
 *
 * @author Maruf Bepary
 */
export type NewArtistInput = z.infer<typeof NewArtistSchema>;
