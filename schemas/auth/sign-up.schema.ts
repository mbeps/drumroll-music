import { z } from "zod";

/**
 * Validates email/password input for the sign-up form.
 * Enforces a minimum password length of 8 characters for new account creation.
 *
 * @see SignInSchema for existing account validation
 * @author Maruf Bepary
 */
export const SignUpSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});

/** Inferred TypeScript type for validated sign-up form data. @author Maruf Bepary */
export type SignUpInput = z.infer<typeof SignUpSchema>;
