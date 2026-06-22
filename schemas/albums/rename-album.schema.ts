import { z } from "zod";
import { albumTitleField } from "./album-title-field";

/**
 * Album rename validation for metadata updates.
 * Validates both the album identity and the new title with consistent constraints.
 *
 * @see albumTitleField for shared title constraints
 * @see CreateAlbumSchema for album creation validation
 * @author Maruf Bepary
 */

/**
 * Validates the payload required to rename an existing album.
 * Both the target album UUID and the new title must be present and well-formed.
 * Failures: invalid UUID triggers "Invalid album ID"; invalid title triggers standard title errors;
 * server verifies user ownership before allowing rename.
 */
export const RenameAlbumSchema = z.object({
  albumId: z.uuid({ message: "Invalid album ID" }),
  newTitle: albumTitleField,
});

/** Inferred input type for {@link RenameAlbumSchema}. */
export type RenameAlbumInput = z.infer<typeof RenameAlbumSchema>;
