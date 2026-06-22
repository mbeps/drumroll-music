import { z } from "zod";
import { artistNameField } from "./artist-name-field";

/**
 * Artist creation validation for music catalog management.
 * Validates artist metadata for new catalog entries; image upload handled separately via ArtistImageFileSchema.
 *
 * @see artistNameField for shared name constraints
 * @author Maruf Bepary
 */

/**
 * Validates input for creating a new artist.
 * Requires a non-empty name of at most 200 characters via {@link artistNameField}.
 * Failures: invalid name triggers standard name constraint errors; server verifies user ownership of created artist.
 */
export const CreateArtistSchema = z.object({
  name: artistNameField,
});

/** Inferred input type for {@link CreateArtistSchema}. */
export type CreateArtistInput = z.infer<typeof CreateArtistSchema>;
