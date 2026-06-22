import { z } from "zod";

/**
 * Playlist deletion validation for user collection removal.
 * Validates the playlist ID and enforces ownership server-side to prevent unauthorized deletions.
 *
 * @author Maruf Bepary
 */

/**
 * Validates a playlist deletion request.
 * Requires only the UUID of the playlist to delete; cascade deletion of associated songs and ownership verification happen server-side.
 * Failures: invalid UUID triggers "Invalid playlist ID"; server also verifies user ownership.
 */
export const DeletePlaylistSchema = z.object({
  playlistId: z.uuid({ message: "Invalid playlist ID" }),
});

/** TypeScript type inferred from {@link DeletePlaylistSchema}. */
export type DeletePlaylistInput = z.infer<typeof DeletePlaylistSchema>;
