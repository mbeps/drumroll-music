import { z } from "zod";

/**
 * Song metadata validation for the multi-step upload flow (Step 3 of 3).
 * Validates song title and track number after artist and album selection; audio file validated separately.
 *
 * @see NewArtistSchema for Step 1 artist selection or creation
 * @see NewAlbumSchema for Step 2 album selection or creation
 * @author Maruf Bepary
 */

/**
 * Validates song metadata entered during Step 3 of the upload flow.
 * Enforces a non-empty trimmed title up to 300 characters and a positive integer track number.
 * Audio file validation is handled separately via {@link SongFileSchema}.
 * Failures: missing title triggers "Song title is required"; exceeding 300 chars triggers "Song title must be 300 characters or fewer";
 * invalid track number triggers "Track number must be a number"; non-integer triggers "Track number must be a whole number";
 * zero/negative triggers "Track number must be at least 1".
 */
export const SongUploadSchema = z.object({
  songTitle: z
    .string()
    .trim()
    .min(1, { message: "Song title is required" })
    .max(300, { message: "Song title must be 300 characters or fewer" }),
  trackNumber: z
    .number({ message: "Track number must be a number" })
    .int({ message: "Track number must be a whole number" })
    .min(1, { message: "Track number must be at least 1" }),
});

/**
 * Inferred input type for {@link SongUploadSchema}.
 *
 * @author Maruf Bepary
 */
export type SongUploadInput = z.infer<typeof SongUploadSchema>;
