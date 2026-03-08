"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { UpdatePasswordSchema } from "@/schemas/user/update-password.schema";

/**
 * Result returned by `updateUserPassword`.
 * On failure, `error` contains a human-readable message describing the reason.
 */
type UpdatePasswordResult = { success: boolean; error?: string };

/**
 * Server action. Updates the password of the currently authenticated user.
 * Guards against OAuth-only accounts — only proceeds when an email identity exists.
 * Re-authenticates via `auth.signInWithPassword` with the current password before applying the change.
 *
 * @param input - Object containing `currentPassword` and `newPassword`.
 * @returns An object indicating success or a descriptive error message.
 * @author Maruf Bepary
 */
const updateUserPassword = async (input: {
  currentPassword: string;
  newPassword: string;
}): Promise<UpdatePasswordResult> => {
  const parsed = UpdatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const hasEmailIdentity =
    user.identities?.some((i) => i.provider === "email") ?? false;

  if (!hasEmailIdentity) {
    return {
      success: false,
      error: "Password change is not available for this account",
    };
  }

  const email = user.email;
  if (!email) {
    return { success: false, error: "No email associated with this account" };
  }

  // Re-authenticate to verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Current password is incorrect" };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
};

export default updateUserPassword;
