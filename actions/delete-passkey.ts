"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Deletes/revokes a registered passkey for the currently authenticated user.
 * Follows the pattern: Validate -> Execute -> Revalidate.
 * 
 * @param passkeyId - UUID of the passkey to delete
 * @returns true if successful, false otherwise
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
      console.error("Error deleting passkey:", error.message);
      return false;
    }

    revalidatePath("/account");
    return true;
  } catch (error) {
    console.error("Unexpected error in DeletePasskey action:", error);
    return false;
  }
};
