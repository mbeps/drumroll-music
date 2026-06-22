import { z } from "zod";

/**
 * Playlist song association validation for adding and removing tracks.
 * Validates the playlist ID and song ID for add/remove operations; ordering is handled by a separate reorder schema.
 *
 * @see ReorderPlaylistSongsSchema for playlist song reordering
 * @author Maruf Bepary
 */

/**
 * Validates a request to add or remove a song from a playlist.
 * Requires a valid playlist UUID and a positive integer song ID.
 * Failures: invalid playlist UUID triggers "Invalid playlist ID";
 * invalid or non-positive song ID triggers "Invalid song ID";
 * server verifies user ownership and prevents duplicate additions.
 */
export const PlaylistSongSchema = z.object({
  playlistId: z.uuid({ message: "Invalid playlist ID" }),
  songId: z.number().int().positive({ message: "Invalid song ID" }),
});

/** TypeScript type inferred from {@link PlaylistSongSchema}. */
export type PlaylistSongInput = z.infer<typeof PlaylistSongSchema>;
