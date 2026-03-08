import { z } from "zod";

/**
 * Validates display name update input for the user profile form.
 * Enforces a non-empty trimmed string capped at 100 characters.
 *
 * @author Maruf Bepary
 */
export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(100, { error: "Name must be 100 characters or fewer" }),
});

/** Inferred input type for {@link UpdateProfileSchema}. */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
