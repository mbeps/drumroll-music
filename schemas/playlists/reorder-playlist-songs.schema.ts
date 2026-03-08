import { z } from "zod";

/**
 * Validates a request to reorder songs within a playlist.
 * Accepts an ordered array of positive integer song IDs representing the desired sequence.
 * The array must contain at least one entry.
 *
 * @author Maruf Bepary
 */
export const ReorderPlaylistSongsSchema = z.object({
  playlistId: z.uuid({ error: "Invalid playlist ID" }),
  songIds: z
    .array(z.number().int().positive({ error: "Invalid song ID" }))
    .min(1, { error: "At least one song ID is required" }),
});

/** TypeScript type inferred from {@link ReorderPlaylistSongsSchema}. @author Maruf Bepary */
export type ReorderPlaylistSongsInput = z.infer<typeof ReorderPlaylistSongsSchema>;
