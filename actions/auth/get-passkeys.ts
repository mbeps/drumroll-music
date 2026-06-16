"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { PasskeyFactor } from "@/types/passkey";

/**
 * Retrieves the list of passkeys registered for the current user.
 * Fetches directly from Supabase Auth via the server-side client.
 * 
 * @returns An array of passkeys or an empty array if an error occurs.
 * @author Maruf Bepary
 */
export const GetPasskeys = async (): Promise<PasskeyFactor[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.passkey.list();

    if (error) {
      console.error("Error fetching passkeys:", error.message);
      return [];
    }

    // Cast as internal domain type match is guaranteed by Supabase API
    return (data as unknown as PasskeyFactor[]) ?? [];
  } catch (error) {
    console.error("Unexpected error in GetPasskeys action:", error);
    return [];
  }
};
