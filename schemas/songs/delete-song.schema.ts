import { z } from "zod";

/**
 * Song deletion validation for content removal operations.
 * Validates the song ID and enforces ownership server-side to prevent unauthorized deletions.
 *
 * @author Maruf Bepary
 */

/**
 * Validates the song ID supplied to the delete-song server action.
 * Ensures the ID is a positive integer before any database query is made.
 * Failures: invalid/non-positive ID triggers "Invalid song ID"; server also verifies user ownership.
 */
export const DeleteSongSchema = z.object({
  songId: z.number().int().positive({ message: "Invalid song ID" }),
});

/**
 * Inferred input type for {@link DeleteSongSchema}.
 *
 * @author Maruf Bepary
 */
export type DeleteSongInput = z.infer<typeof DeleteSongSchema>;
