import { z } from "zod";
import { albumTitleField } from "./album-title-field";

/**
 * Validates the payload required to rename an existing album.
 * Both the target album UUID and the new title must be present and well-formed.
 *
 * @author Maruf Bepary
 */
export const RenameAlbumSchema = z.object({
  albumId: z.uuid({ error: "Invalid album ID" }),
  newTitle: albumTitleField,
});

/** Inferred input type for {@link RenameAlbumSchema}. @author Maruf Bepary */
export type RenameAlbumInput = z.infer<typeof RenameAlbumSchema>;
