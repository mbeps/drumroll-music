import { z } from "zod";

/**
 * Authentication sign-in validation for email/password credentials.
 * Enforces valid email format and non-empty password; used by the sign-in form and Supabase auth flow.
 *
 * @see SignUpSchema for new account creation with stricter password requirements
 * @see ForgotPasswordSchema for password recovery
 * @author Maruf Bepary
 */

/**
 * Validates email/password credentials for the sign-in form.
 * Requires a valid email format and a non-empty password string.
 * Failures: invalid email format triggers "Enter a valid email address"; empty password triggers "Password is required".
 */
export const SignInSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

/** Inferred TypeScript type for validated sign-in form data. */
export type SignInInput = z.infer<typeof SignInSchema>;
