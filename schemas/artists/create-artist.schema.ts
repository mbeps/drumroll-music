import { z } from "zod";
import { artistNameField } from "./artist-name-field";

/**
 * Validates input for creating a new artist.
 * Requires a non-empty name of at most 200 characters.
 *
 * @author Maruf Bepary
 */
export const CreateArtistSchema = z.object({
  name: artistNameField,
});

/** Inferred input type for CreateArtistSchema. @author Maruf Bepary */
export type CreateArtistInput = z.infer<typeof CreateArtistSchema>;
