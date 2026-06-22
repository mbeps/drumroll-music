/**
 * Server action to delete/revoke a passkey registered by the authenticated user.
 * Removes the WebAuthn credential from Supabase Auth.
 * Revalidates the /account path to refresh the UI.
 *
 * @module actions/auth/delete-passkey
 * @author Maruf Bepary
 */
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "auth"]);

/**
 * Deletes/revokes a registered passkey for the currently authenticated user.
 * Calls Supabase Auth passkey deletion API to remove the WebAuthn credential.
 * Revalidates /account on success to refresh passkey list display.
 *
 * @param passkeyId - UUID of the passkey to delete
 * @returns true on successful deletion, false on validation, authentication, or API error
 * @throws No exceptions thrown; returns false on error
 * @see GetPasskeys for fetching the current user's passkeys
 * @see RenamePasskey for renaming a passkey
 * @author Maruf Bepary
 */
export const DeletePasskey = async (passkeyId: string): Promise<boolean> => {
  if (!passkeyId) return false;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.passkey.delete({
      passkeyId,
    });

    if (error) {
      logger.error("Error deleting passkey {id}: {message}", {
        id: passkeyId,
        message: error.message,
      });
      return false;
    }

    logger.info("Successfully deleted passkey: {id}", { id: passkeyId });
    revalidatePath("/account");
    return true;
  } catch (error) {
    logger.error("Unexpected error in DeletePasskey action: {error}", {
      error,
    });
    return false;
  }
};
