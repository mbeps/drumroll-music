import { z } from "zod";

import { UpdatePasswordSchema } from "./update-password.schema";

/**
 * User account password change validation for client-side form handling.
 * Extends server-side validation with a confirmation field and cross-field matching to improve UX before submission.
 *
 * @see UpdatePasswordSchema for the server action variant without confirmation
 * @author Maruf Bepary
 */

/**
 * Client-side password change schema extending {@link UpdatePasswordSchema} with a `confirmPassword` field.
 * Applies cross-field refinement to ensure new password and confirmation match before allowing submission.
 * Failures: mismatched passwords trigger "Passwords do not match" on the `confirmPassword` field.
 */
export const ChangePasswordSchema = UpdatePasswordSchema.extend({
  confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/** Inferred input type for {@link ChangePasswordSchema} — includes `confirmPassword`; used by the client form. */
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
