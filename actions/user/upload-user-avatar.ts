/**
 * Server action to upload and store a new profile avatar for the authenticated user.
 * Validates file type (JPEG, PNG, WebP, GIF) and size (max 5MB).
 * Performs dual storage limit checks; removes old avatar from storage.
 * Stores the storage path (not URL) in public.users.avatar_url.
 *
 * @module actions/user/upload-user-avatar
 * @author Maruf Bepary
 */
"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ROUTES } from "@/routes";
import { FILE_LIMITS } from "@/lib/env";
import { AVATAR_ALLOWED_TYPES } from "@/schemas/user/avatar-constants";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";
import { getFileSize } from "@/lib/storage-limit/get-file-size";

/**
 * Uploads a new avatar image for the currently authenticated user.
 * Validates file type (JPEG, PNG, WebP, GIF) and size (max 5MB).
 * Performs dual storage limit validation (user 1GB, global 50GB); returns error if limits exceeded.
 * Removes the previous avatar from storage before inserting the new one.
 * Stores the storage path (not URL) in `public.users.avatar_url`.
 *
 * @param formData - FormData containing the `avatar` file field
 * @returns Object with `avatarUrl` storage path on success, null on validation, storage limit, or upload error
 * @throws ValidationError if file type is not in AVATAR_ALLOWED_TYPES or size exceeds 5MB
 * @throws UnauthorizedError if user is not authenticated
 * @throws StorageLimitError if combined user or global storage limit would be exceeded
 * @throws DatabaseError if database update fails
 * @see deleteUserAvatar for removing the avatar
 * @see validateStorageForUpload for pre-upload storage limit validation
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
  if (file.size > FILE_LIMITS.AVATAR_MAX_BYTES) return null;

  // Fetch current avatar path for cleanup
  const { data: userRow } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const oldAvatarPath = userRow?.avatar_url ?? null;

  // Storage limit validation
  const oldAvatarSize = oldAvatarPath ? await getFileSize("images", oldAvatarPath) : 0;
  const limitCheck = await validateStorageLimits(file.size, user.id, oldAvatarSize);
  
  if (!limitCheck.ok) {
    console.warn(`Upload blocked: ${limitCheck.error}`);
    return null;
  }

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
