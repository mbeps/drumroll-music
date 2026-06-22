import { z } from "zod";

/**
 * User profile metadata validation for account display settings.
 * Validates user display name updates with sanitization and length constraints for consistency across the UI.
 *
 * @author Maruf Bepary
 */

/**
 * Validates display name update input for the user profile form.
 * Enforces a non-empty trimmed string capped at 100 characters to prevent excessive blank entries or overflow.
 * Failures: missing/blank name triggers "Name is required"; exceeding 100 chars triggers "Name must be 100 characters or fewer".
 */
export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or fewer" }),
});

/** Inferred input type for {@link UpdateProfileSchema}. */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
