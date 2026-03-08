import { z } from "zod";

import { UpdatePasswordSchema } from "./update-password.schema";

/**
 * Extends {@link UpdatePasswordSchema} with a `confirmPassword` field and a cross-field
 * refinement that ensures the new password and confirmation match.
 * Used exclusively by the `PasswordForm` client component.
 *
 * @see UpdatePasswordSchema for the server action variant
 * @author Maruf Bepary
 */
export const ChangePasswordSchema = UpdatePasswordSchema.extend({
  confirmPassword: z.string().min(1, { error: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/** Inferred input type for {@link ChangePasswordSchema} — includes `confirmPassword`; used by the client form. */
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
