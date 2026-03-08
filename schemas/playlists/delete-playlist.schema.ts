import { z } from "zod";

/**
 * Validates a playlist deletion request.
 * Requires only the UUID of the playlist to delete.
 *
 * @author Maruf Bepary
 */
export const DeletePlaylistSchema = z.object({
  playlistId: z.uuid({ error: "Invalid playlist ID" }),
});

/** TypeScript type inferred from {@link DeletePlaylistSchema}. @author Maruf Bepary */
export type DeletePlaylistInput = z.infer<typeof DeletePlaylistSchema>;
