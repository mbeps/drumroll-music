import { z } from "zod";

/**
 * Validates a request to add or remove a song from a playlist.
 * Requires a valid playlist UUID and a positive integer song ID.
 *
 * @author Maruf Bepary
 */
export const PlaylistSongSchema = z.object({
  playlistId: z.uuid({ error: "Invalid playlist ID" }),
  songId: z.number().int().positive({ error: "Invalid song ID" }),
});

/** TypeScript type inferred from {@link PlaylistSongSchema}. @author Maruf Bepary */
export type PlaylistSongInput = z.infer<typeof PlaylistSongSchema>;
