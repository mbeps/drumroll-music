import { z } from "zod";
import { playlistTitleField } from "./playlist-title-field";

/**
 * Playlist rename validation for collection metadata updates.
 * Validates both the playlist identity and the new title with consistent constraints.
 *
 * @see playlistTitleField for shared title constraints
 * @see CreatePlaylistSchema for playlist creation validation
 * @author Maruf Bepary
 */

/**
 * Validates a playlist rename request.
 * Requires a valid playlist UUID and a non-empty title of up to 100 characters via {@link playlistTitleField}.
 * Failures: invalid UUID triggers "Invalid playlist ID"; invalid title triggers standard title constraint errors;
 * server verifies user ownership before allowing rename.
 */
export const RenamePlaylistSchema = z.object({
  playlistId: z.uuid({ message: "Invalid playlist ID" }),
  newTitle: playlistTitleField,
});

/** TypeScript type inferred from {@link RenamePlaylistSchema}. */
export type RenamePlaylistInput = z.infer<typeof RenamePlaylistSchema>;
