import { z } from "zod";
import { playlistTitleField } from "./playlist-title-field";

/**
 * Validates a playlist creation request.
 * Requires a non-empty title of up to 100 characters.
 *
 * @see RenamePlaylistSchema for updating existing playlist titles
 * @author Maruf Bepary
 */
export const CreatePlaylistSchema = z.object({
  title: playlistTitleField,
});

/** TypeScript type inferred from {@link CreatePlaylistSchema}. @author Maruf Bepary */
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistSchema>;
