import { z } from "zod";
import { playlistTitleField } from "./playlist-title-field";

/**
 * Validates a playlist rename request.
 * Requires a valid playlist UUID and a non-empty title of up to 100 characters.
 *
 * @see CreatePlaylistSchema for creating a new playlist
 * @author Maruf Bepary
 */
export const RenamePlaylistSchema = z.object({
  playlistId: z.uuid({ error: "Invalid playlist ID" }),
  newTitle: playlistTitleField,
});

/** TypeScript type inferred from {@link RenamePlaylistSchema}. @author Maruf Bepary */
export type RenamePlaylistInput = z.infer<typeof RenamePlaylistSchema>;
