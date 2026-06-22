import { z } from "zod";

/**
 * Playlist metadata validation field for shared title constraints.
 * Centralizes playlist name validation rules to ensure consistency across create, rename, and update operations.
 *
 * @author Maruf Bepary
 */

/**
 * Shared base field for playlist titles.
 * Enforces trimming, a minimum of 1 character, and a maximum of 100 characters to keep playlist names concise.
 * Reused by {@link CreatePlaylistSchema} and {@link RenamePlaylistSchema} to keep constraints consistent and DRY.
 */
export const playlistTitleField = z
  .string()
  .trim()
  .min(1, { message: "Playlist name is required" })
  .max(100, { message: "Playlist name must be 100 characters or fewer" });
