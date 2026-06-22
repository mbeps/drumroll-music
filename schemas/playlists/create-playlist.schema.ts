import { z } from "zod";
import { playlistTitleField } from "./playlist-title-field";

/**
 * Playlist creation validation for user-owned song collections.
 * Validates playlist metadata for new user playlists; does not handle the special "Favourites" playlist (managed separately).
 *
 * @see playlistTitleField for shared title constraints
 * @see RenamePlaylistSchema for updating existing playlist names
 * @author Maruf Bepary
 */

/**
 * Validates a playlist creation request.
 * Requires a non-empty title of up to 100 characters via {@link playlistTitleField}.
 * Failures: invalid title triggers standard title constraint errors; server associates the new playlist with the authenticated user.
 */
export const CreatePlaylistSchema = z.object({
  title: playlistTitleField,
});

/** TypeScript type inferred from {@link CreatePlaylistSchema}. */
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistSchema>;
