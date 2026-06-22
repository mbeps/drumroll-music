/**
 * Server action to rename a registered passkey.
 * Updates the friendly name of a WebAuthn credential in Supabase Auth.
 * Revalidates the /account path to refresh the UI.
 *
 * @module actions/auth/rename-passkey
 * @author Maruf Bepary
 */
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { PasskeyRenameSchema } from "@/schemas/auth/passkey-rename.schema";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "auth"]);

/**
 * Renames a registered passkey for the currently authenticated user.
 * Updates the friendly name of a WebAuthn credential via Supabase Auth.
 * Revalidates /account on success to refresh passkey list display.
 *
 * @param passkeyId - UUID of the passkey to rename
 * @param newName - New friendly name for the passkey
 * @returns true on successful rename, false on validation, authentication, or API error
 * @throws No exceptions thrown; returns false on error
 * @see GetPasskeys for fetching the current user's passkeys
 * @see DeletePasskey for deleting a passkey
 * @author Maruf Bepary
 */
export const RenamePasskey = async (
  passkeyId: string,
  newName: string
): Promise<boolean> => {
  const parsed = PasskeyRenameSchema.safeParse({ passkeyId, newName });
  if (!parsed.success) return false;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.passkey.update({
      passkeyId: parsed.data.passkeyId,
      friendlyName: parsed.data.newName,
    });

    if (error) {
      logger.error("Error renaming passkey: {message}", {
        message: error.message,
      });
      return false;
    }

    revalidatePath("/account");
    return true;
  } catch (error) {
    logger.error("Unexpected error in RenamePasskey action: {error}", {
      error,
    });
    return false;
  }
};
