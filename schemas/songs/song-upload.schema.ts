import { z } from "zod";

/**
 * Validates song metadata entered during Step 3 of the upload flow.
 * Covers the song title and track number; audio file validation is handled separately.
 *
 * @see NewAlbumSchema for the preceding album validation step
 * @author Maruf Bepary
 */
export const SongUploadSchema = z.object({
  songTitle: z
    .string()
    .trim()
    .min(1, { error: "Song title is required" })
    .max(300, { error: "Song title must be 300 characters or fewer" }),
  trackNumber: z
    .number({ error: "Track number must be a number" })
    .int({ error: "Track number must be a whole number" })
    .min(1, { error: "Track number must be at least 1" }),
});

/**
 * Inferred input type for {@link SongUploadSchema}.
 *
 * @author Maruf Bepary
 */
export type SongUploadInput = z.infer<typeof SongUploadSchema>;
