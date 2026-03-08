import { z } from "zod";

export const playlistTitleField = z
  .string()
  .trim()
  .min(1, { error: "Playlist name is required" })
  .max(100, { error: "Playlist name must be 100 characters or fewer" });
