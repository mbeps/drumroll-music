import { z } from "zod";

/**
 * Artist metadata validation field for shared name constraints.
 * Centralizes artist name validation rules to ensure consistency across create, rename, and update operations.
 *
 * @author Maruf Bepary
 */

/**
 * Shared base field for artist names.
 * Enforces trimming, a minimum of 1 character, and a maximum of 200 characters.
 * Reused by {@link CreateArtistSchema} and {@link RenameArtistSchema} to keep constraints consistent and DRY.
 */
export const artistNameField = z
  .string()
  .trim()
  .min(1, { message: "Artist name is required" })
  .max(200, { message: "Artist name must be 200 characters or fewer" });
