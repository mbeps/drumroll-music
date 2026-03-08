import { z } from "zod";

/**
 * Validates email/password credentials for the sign-in form.
 * Requires a valid email and a non-empty password.
 *
 * @see SignUpSchema for new account validation
 * @see ForgotPasswordSchema for password reset validation
 * @author Maruf Bepary
 */
export const SignInSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

/** Inferred TypeScript type for validated sign-in form data. @author Maruf Bepary */
export type SignInInput = z.infer<typeof SignInSchema>;
