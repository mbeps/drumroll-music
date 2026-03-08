import { z } from "zod";

/**
 * Validates the raw password update payload used by the server action.
 * Does not include a `confirmPassword` field — confirmation is handled on the client only.
 *
 * @see ChangePasswordSchema for the client-side form variant
 * @author Maruf Bepary
 */
export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { error: "Current password is required" }),
  newPassword: z.string().min(8, { error: "New password must be at least 8 characters" }),
});

/** Inferred input type for {@link UpdatePasswordSchema} — passed directly to the server action. */
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
