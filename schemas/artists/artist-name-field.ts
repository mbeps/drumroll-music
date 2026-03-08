import { z } from "zod";

export const artistNameField = z
  .string()
  .trim()
  .min(1, { error: "Artist name is required" })
  .max(200, { error: "Artist name must be 200 characters or fewer" });
