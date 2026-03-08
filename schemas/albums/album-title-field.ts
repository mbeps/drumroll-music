import { z } from "zod";

/**
 * Shared base field for album titles.
 * Enforces trimming, a minimum of 1 character, and a maximum of 200 characters.
 * Reused by CreateAlbumSchema and RenameAlbumSchema to keep constraints consistent.
 *
 * @author Maruf Bepary
 */
export const albumTitleField = z
  .string()
  .trim()
  .min(1, { error: "Album title is required" })
  .max(200, { error: "Album title must be 200 characters or fewer" });
