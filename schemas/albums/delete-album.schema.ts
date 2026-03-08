import { z } from "zod";

/**
 * Validates the payload required to delete an album.
 * Only the album UUID is needed; ownership is enforced server-side.
 *
 * @author Maruf Bepary
 */
export const DeleteAlbumSchema = z.object({
  albumId: z.uuid({ error: "Invalid album ID" }),
});

/** Inferred input type for {@link DeleteAlbumSchema}. @author Maruf Bepary */
export type DeleteAlbumInput = z.infer<typeof DeleteAlbumSchema>;
