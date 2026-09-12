import { z } from "zod";

/**
 * Playlist song ordering validation for manual drag-and-drop reordering via dnd-kit.
 * Validates the playlist ID and the ordered sequence of song IDs after user reordering.
 *
 * @see PlaylistSongSchema for add/remove song operations
 * @author Maruf Bepary
 */

/**
 * Validates a request to reorder songs within a playlist.
 * Accepts an ordered array of positive integer song IDs representing the desired sequence.
 * The array must contain at least one entry to prevent accidental emptying of playlists.
 * Failures: invalid playlist UUID triggers "Invalid playlist ID";
 * invalid/non-positive song ID triggers "Invalid song ID";
 * empty array triggers "At least one song ID is required";
 * server verifies user ownership and updates the position field in playlist_songs.
 */
export const ReorderPlaylistSongsSchema = z.object({
  playlistId: z.uuid({ message: "Invalid playlist ID" }),
  songIds: z
    .array(z.number().int().positive({ message: "Invalid song ID" }))
    .min(1, { message: "At least one song ID is required" }),
});

/** TypeScript type inferred from {@link ReorderPlaylistSongsSchema}. */
export type ReorderPlaylistSongsInput = z.infer<typeof ReorderPlaylistSongsSchema>;
