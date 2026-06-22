/**
 * Server action to retrieve registered passkeys for the authenticated user.
 * Fetches passkey metadata from Supabase Auth WebAuthn factors.
 * Used by the Account settings to display passkey management UI.
 *
 * @module actions/auth/get-passkeys
 * @author Maruf Bepary
 */
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { PasskeyFactor } from "@/types/passkey";
import { getLogger } from "@/lib/logger";

const logger = getLogger(["app", "actions", "auth"]);

/**
 * Retrieves the list of passkeys registered for the currently authenticated user.
 * Fetches directly from Supabase Auth via server-side client; no database query.
 * Returns empty array on authentication failure or Supabase API error (graceful degradation).
 *
 * @returns Array of PasskeyFactor objects (WebAuthn passkeys) or empty array on error
 * @throws No exceptions thrown; returns empty array on authentication failure or API error
 * @see DeletePasskey for removing a passkey
 * @see RenamePasskey for renaming a passkey
 * @author Maruf Bepary
 */
export const GetPasskeys = async (): Promise<PasskeyFactor[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.passkey.list();

    if (error) {
      logger.error("Error fetching passkeys: {message}", {
        message: error.message,
      });
      return [];
    }

    // Cast as internal domain type match is guaranteed by Supabase API
    return (data as unknown as PasskeyFactor[]) ?? [];
  } catch (error) {
    logger.error("Unexpected error in GetPasskeys action: {error}", {
      error,
    });
    return [];
  }
};
