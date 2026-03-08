import { z } from "zod";

/**
 * Validates input for deleting an artist.
 * Requires a valid UUID artistId.
 *
 * @author Maruf Bepary
 */
export const DeleteArtistSchema = z.object({
  artistId: z.uuid({ error: "Invalid artist ID" }),
});

/** Inferred input type for DeleteArtistSchema. @author Maruf Bepary */
export type DeleteArtistInput = z.infer<typeof DeleteArtistSchema>;
