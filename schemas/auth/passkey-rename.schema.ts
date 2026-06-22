import { z } from "zod";

/**
 * Authentication passkey management validation for renaming WebAuthn factors.
 * Enables users to update the friendly name of registered passkeys for improved device identification.
 *
 * @see PasskeyFactor in types/passkey.ts for WebAuthn factor metadata structure
 * @author Maruf Bepary
 */

/**
 * Validates a request to rename a registered passkey.
 * Requires a valid passkey UUID and a trimmed "friendly name" between 1 and 50 characters for clarity.
 * Failures: invalid UUID triggers "Invalid passkey ID"; empty/missing name triggers "Passkey name is required"; exceeding 50 chars triggers "Passkey name must be 50 characters or fewer".
 */
export const PasskeyRenameSchema = z.object({
  passkeyId: z.uuid({ message: "Invalid passkey ID" }),
  newName: z
    .string()
    .trim()
    .min(1, { message: "Passkey name is required" })
    .max(50, { message: "Passkey name must be 50 characters or fewer" }),
});

/** Inferred TypeScript type for validated passkey renaming data. */
export type PasskeyRenameInput = z.infer<typeof PasskeyRenameSchema>;
