import { z } from "zod";

/**
 * Authentication password recovery validation for email-based reset flow.
 * Collects the email address to send a Supabase password recovery link; no password required at this stage.
 *
 * @see SignInSchema for sign-in flow
 * @author Maruf Bepary
 */

/**
 * Validates the email address submitted in the forgot-password form.
 * Only an email field is required; Supabase sends the reset link to this address.
 * Failures: invalid email format triggers "Enter a valid email address".
 */
export const ForgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

/** Inferred TypeScript type for validated forgot-password form data. */
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
