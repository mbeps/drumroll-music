import { z } from "zod";

/**
 * Album metadata validation field for shared title constraints.
 * Centralizes album title validation rules to ensure consistency across create, rename, and update operations.
 *
 * @author Maruf Bepary
 */

/**
 * Shared base field for album titles.
 * Enforces trimming, a minimum of 1 character, and a maximum of 200 characters.
 * Reused by {@link CreateAlbumSchema} and {@link RenameAlbumSchema} to keep constraints consistent and DRY.
 */
export const albumTitleField = z
  .string()
  .trim()
  .min(1, { message: "Album title is required" })
  .max(200, { message: "Album title must be 200 characters or fewer" });
