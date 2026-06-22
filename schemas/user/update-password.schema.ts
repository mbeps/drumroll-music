import { z } from "zod";

/**
 * User account password update validation for server actions.
 * Validates current password verification and new password strength without client-side confirmation duplication.
 *
 * @see ChangePasswordSchema for the client-side variant with confirmation field
 * @author Maruf Bepary
 */

/**
 * Server-side password update schema for email-authenticated users.
 * Requires verification of the current password and a new password of minimum 8 characters.
 * Confirmation is handled client-side only via {@link ChangePasswordSchema}.
 * Failures: missing current password triggers "Current password is required";
 * new password < 8 chars triggers "New password must be at least 8 characters".
 */
export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
});

/** Inferred input type for {@link UpdatePasswordSchema} — passed directly to the server action. */
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
