import { z } from "zod";
import { artistNameField } from "./artist-name-field";

/**
 * Artist rename validation for metadata updates.
 * Validates both the artist identity and the new name with consistent constraints.
 *
 * @see artistNameField for shared name constraints
 * @see CreateArtistSchema for artist creation validation
 * @author Maruf Bepary
 */

/**
 * Validates input for renaming an existing artist.
 * Requires a valid UUID artistId and a non-empty name of at most 200 characters via {@link artistNameField}.
 * Failures: invalid UUID triggers "Invalid artist ID"; invalid name triggers standard name constraint errors;
 * server verifies user ownership before allowing rename.
 */
export const RenameArtistSchema = z.object({
  artistId: z.uuid({ message: "Invalid artist ID" }),
  newName: artistNameField,
});

/** Inferred input type for {@link RenameArtistSchema}. */
export type RenameArtistInput = z.infer<typeof RenameArtistSchema>;
