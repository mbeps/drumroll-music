"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ROUTES } from "@/routes";
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_SIZE_BYTES } from "@/schemas/user/avatar-constants";

/**
 * Server action. Uploads a new avatar image for the currently authenticated user.
 * Validates file type (JPEG, PNG, WebP, GIF) and size (max 5 MB).
 * Removes the previous avatar from the `images` storage bucket before uploading the new one.
 * Stores the storage path — not a full URL — in `public.users.avatar_url`.
 *
 * @param formData - FormData containing the `avatar` file field.
 * @returns An object with the new `avatarUrl` storage path, or null on validation or upload failure.
 * @author Maruf Bepary
 */
const uploadUserAvatar = async (
  formData: FormData
): Promise<{ avatarUrl: string } | null> => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const file = formData.get("avatar");
  if (!(file instanceof File)) return null;
  if (!(AVATAR_ALLOWED_TYPES as readonly string[]).includes(file.type)) return null;
  if (file.size > AVATAR_MAX_SIZE_BYTES) return null;

  // Fetch current avatar path for cleanup
  const { data: userRow } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const oldAvatarPath = userRow?.avatar_url ?? null;

  // Upload new avatar to storage — use only the sanitized extension from the filename
  const rawExt = file.name.split(".").pop() ?? "";
  const safeExt = rawExt.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const timestamp = Date.now();
  const avatarPath = `avatars/${user.id}/${timestamp}.${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(avatarPath, file, { contentType: file.type, upsert: false });

  if (uploadError) return null;

  // Update database with new avatar path
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: avatarPath })
    .eq("id", user.id);

  if (updateError) {
    // Best-effort: remove the just-uploaded file since DB update failed
    await supabase.storage.from("images").remove([avatarPath]);
    return null;
  }

  // Best-effort: remove old avatar from storage
  if (oldAvatarPath && oldAvatarPath !== avatarPath) {
    await supabase.storage.from("images").remove([oldAvatarPath]);
  }

  revalidatePath(ROUTES.ACCOUNT.path);
  return { avatarUrl: avatarPath };
};

export default uploadUserAvatar;
