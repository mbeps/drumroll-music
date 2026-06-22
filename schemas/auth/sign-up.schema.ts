import { z } from "zod";

/**
 * Authentication sign-up validation for new user account creation.
 * Enforces valid email format and 8-character minimum password for security; used by Supabase auth registration flow.
 *
 * @see SignInSchema for existing account sign-in with relaxed password requirements
 * @author Maruf Bepary
 */

/**
 * Validates email/password input for the sign-up form.
 * Enforces a minimum password length of 8 characters to meet security baseline for new account creation.
 * Failures: invalid email triggers "Enter a valid email address"; password < 8 chars triggers "Password must be at least 8 characters".
 */
export const SignUpSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

/** Inferred TypeScript type for validated sign-up form data. */
export type SignUpInput = z.infer<typeof SignUpSchema>;
