import { z } from "zod";

/**
 * Validates a request to rename a registered passkey.
 * Requires a "friendly name" between 1 and 50 characters.
 *
 * @see PasskeyFactor in types/passkey.ts for the entity definition
 * @author Maruf Bepary
 */
export const PasskeyRenameSchema = z.object({
  passkeyId: z.uuid({ message: "Invalid passkey ID" }),
  newName: z
    .string()
    .trim()
    .min(1, { message: "Passkey name is required" })
    .max(50, { message: "Passkey name must be 50 characters or fewer" }),
});

/** Inferred TypeScript type for validated passkey renaming data. @author Maruf Bepary */
export type PasskeyRenameInput = z.infer<typeof PasskeyRenameSchema>;
