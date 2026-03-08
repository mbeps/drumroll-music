import { z } from "zod";

/**
 * Validates the email address submitted in the forgot-password form.
 * Only an email field is required to trigger a Supabase password reset email.
 *
 * @see SignInSchema for sign-in validation
 * @author Maruf Bepary
 */
export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
});

/** Inferred TypeScript type for validated forgot-password form data. @author Maruf Bepary */
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
