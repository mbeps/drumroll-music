import { z } from "zod";

/**
 * Album creation validation for the multi-step song upload flow (Step 2 of 3).
 * Validates the album title when a user chooses to create a new album instead of selecting an existing one.
 *
 * @see NewArtistSchema for Step 1 artist selection or creation
 * @see SongUploadSchema for Step 3 song metadata validation
 * @author Maruf Bepary
 */

/**
 * Validates the album title entered during Step 2 of the upload flow.
 * Applied when the user chooses to create a new album rather than selecting an existing one.
 * Enforces non-empty trimmed title up to 200 characters.
 * Failures: missing title triggers "Album title is required"; exceeding 200 chars triggers "Album title must be 200 characters or fewer".
 */
export const NewAlbumSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Album title is required" })
    .max(200, { message: "Album title must be 200 characters or fewer" }),
});

/**
 * Inferred input type for {@link NewAlbumSchema}.
 *
 * @author Maruf Bepary
 */
export type NewAlbumInput = z.infer<typeof NewAlbumSchema>;
