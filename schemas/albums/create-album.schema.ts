import { z } from "zod";
import { albumTitleField } from "./album-title-field";

/**
 * Album creation validation for music catalog management.
 * Validates album metadata and artist association via the album_artists junction table.
 *
 * @see albumTitleField for shared title constraints
 * @author Maruf Bepary
 */

/**
 * Validates the payload required to create a new album.
 * Requires a valid title via {@link albumTitleField} and an existing artist UUID to link via album_artists junction.
 * Failures: invalid title triggers standard title errors; invalid artist UUID triggers "Please select a valid artist".
 */
export const CreateAlbumSchema = z.object({
  title: albumTitleField,
  artistId: z.uuid({ message: "Please select a valid artist" }),
});

/** Inferred input type for {@link CreateAlbumSchema}. */
export type CreateAlbumInput = z.infer<typeof CreateAlbumSchema>;
