import { z } from "zod";
import { albumTitleField } from "./album-title-field";

/**
 * Validates the payload required to create a new album.
 * Requires a valid title and an existing artist UUID to link via album_artists.
 *
 * @author Maruf Bepary
 */
export const CreateAlbumSchema = z.object({
  title: albumTitleField,
  artistId: z.uuid({ error: "Please select a valid artist" }),
});

/** Inferred input type for {@link CreateAlbumSchema}. @author Maruf Bepary */
export type CreateAlbumInput = z.infer<typeof CreateAlbumSchema>;
