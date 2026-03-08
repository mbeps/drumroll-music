import { z } from "zod";

/**
 * Validates the album title entered during Step 2 of the upload flow.
 * Applied when the user chooses to create a new album rather than selecting an existing one.
 *
 * @see SongUploadSchema for the subsequent song metadata validation step
 * @author Maruf Bepary
 */
export const NewAlbumSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Album title is required" })
    .max(200, { error: "Album title must be 200 characters or fewer" }),
});

/**
 * Inferred input type for {@link NewAlbumSchema}.
 *
 * @author Maruf Bepary
 */
export type NewAlbumInput = z.infer<typeof NewAlbumSchema>;
