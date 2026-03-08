import { z } from "zod";

/**
 * Validates the artist name entered during Step 1 of the upload flow.
 * Applied when the user chooses to create a new artist rather than selecting an existing one.
 *
 * @see NewAlbumSchema for the subsequent album validation step
 * @author Maruf Bepary
 */
export const NewArtistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Artist name is required" })
    .max(200, { error: "Artist name must be 200 characters or fewer" }),
});

/**
 * Inferred input type for {@link NewArtistSchema}.
 *
 * @author Maruf Bepary
 */
export type NewArtistInput = z.infer<typeof NewArtistSchema>;
