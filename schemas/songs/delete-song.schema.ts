import { z } from "zod";

/**
 * Validates the song ID supplied to the delete-song server action.
 * Ensures the ID is a positive integer before any database query is made.
 *
 * @author Maruf Bepary
 */
export const DeleteSongSchema = z.object({
  songId: z.number().int().positive({ error: "Invalid song ID" }),
});

/**
 * Inferred input type for {@link DeleteSongSchema}.
 *
 * @author Maruf Bepary
 */
export type DeleteSongInput = z.infer<typeof DeleteSongSchema>;
