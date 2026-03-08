import { z } from "zod";
import { artistNameField } from "./artist-name-field";

/**
 * Validates input for renaming an existing artist.
 * Requires a valid UUID artistId and a non-empty name of at most 200 characters.
 *
 * @author Maruf Bepary
 */
export const RenameArtistSchema = z.object({
  artistId: z.uuid({ error: "Invalid artist ID" }),
  newName: artistNameField,
});

/** Inferred input type for RenameArtistSchema. @author Maruf Bepary */
export type RenameArtistInput = z.infer<typeof RenameArtistSchema>;
