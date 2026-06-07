"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { PasskeyRenameSchema } from "@/schemas/auth/passkey-rename.schema";

/**
 * Renames a registered passkey for the currently authenticated user.
 * Follows the pattern: Validate -> Execute -> Revalidate.
 * 
 * @param passkeyId - UUID of the passkey to rename
 * @param newName - The new name to assign to the passkey
 * @returns true if successful, false otherwise
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
      console.error("Error renaming passkey:", error.message);
      return false;
    }

    revalidatePath("/account");
    return true;
  } catch (error) {
    console.error("Unexpected error in RenamePasskey action:", error);
    return false;
  }
};
