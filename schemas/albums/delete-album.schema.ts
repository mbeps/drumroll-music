import { z } from "zod";

/**
 * Album deletion validation for content removal operations.
 * Validates the album ID and enforces ownership server-side to prevent unauthorized deletions.
 *
 * @author Maruf Bepary
 */

/**
 * Validates the payload required to delete an album.
 * Only the album UUID is needed; ownership and cascade deletion of associated songs are enforced server-side.
 * Failures: invalid UUID triggers "Invalid album ID"; server also verifies user ownership.
 */
export const DeleteAlbumSchema = z.object({
  albumId: z.uuid({ message: "Invalid album ID" }),
});

/** Inferred input type for {@link DeleteAlbumSchema}. */
export type DeleteAlbumInput = z.infer<typeof DeleteAlbumSchema>;
