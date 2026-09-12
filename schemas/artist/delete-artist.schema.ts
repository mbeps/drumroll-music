import { z } from "zod";

/**
 * Artist deletion validation for content removal operations.
 * Validates the artist ID and enforces ownership server-side to prevent unauthorized deletions.
 *
 * @author Maruf Bepary
 */

/**
 * Validates input for deleting an artist.
 * Requires a valid UUID artistId; ownership and cascade deletion of associated albums are enforced server-side.
 * Failures: invalid UUID triggers "Invalid artist ID"; server also verifies user ownership.
 */
export const DeleteArtistSchema = z.object({
  artistId: z.uuid({ message: "Invalid artist ID" }),
});

/** Inferred input type for {@link DeleteArtistSchema}. */
export type DeleteArtistInput = z.infer<typeof DeleteArtistSchema>;
