"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useLoadImage from "@/hooks/useLoadImage";
import { getInitials } from "@/lib/utils";
import uploadUserAvatar from "@/actions/uploadUserAvatar";
import deleteUserAvatar from "@/actions/deleteUserAvatar";
import { AvatarFileSchema } from "@/schemas/user/avatar-file.schema";

/**
 * Props for AvatarSection.
 */
interface AvatarSectionProps {
  /** Storage path in the `images` bucket, or null when no avatar is set. */
  avatarUrl: string | null;
  /** User's display name used for initials fallback; falls back to email initials if null. */
  displayName: string | null;
  /** User's email address, displayed beneath the display name. */
  email: string;
}

/**
 * Avatar display area with controls to upload a new image or remove the current one.
 * Shows initials derived from the display name or email as a fallback when no avatar is set.
 * Calls `uploadUserAvatar` or `deleteUserAvatar` server actions and refreshes the page on success.
 *
 * @author Maruf Bepary
 */
const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  displayName,
  email,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const resolvedAvatarUrl = useLoadImage(avatarUrl);
  const initials = getInitials(displayName ?? email);
  const isLoading = isUploading || isDeleting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = AvatarFileSchema.safeParse(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Invalid file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    startUpload(async () => {
      const result = await uploadUserAvatar(formData);
      if (result) {
        toast.success("Avatar updated");
        router.refresh();
      } else {
        toast.error(
          "Failed to update avatar. Use JPEG, PNG, WebP or GIF under 5 MB."
        );
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleDelete = () => {
    startDelete(async () => {
      const success = await deleteUserAvatar();
      if (success) {
        toast.success("Avatar removed");
        router.refresh();
      } else {
        toast.error("Failed to remove avatar");
      }
    });
  };

  return (
    <div className="flex items-center gap-6">
      {/* Avatar with camera overlay */}
      <div className="relative group shrink-0">
        <Avatar className="size-24 md:size-[120px]">
          {resolvedAvatarUrl && (
            <AvatarImage
              src={resolvedAvatarUrl}
              alt={displayName ?? "User avatar"}
            />
          )}
          <AvatarFallback className="text-2xl md:text-3xl bg-muted text-muted-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
          aria-label="Upload new avatar"
        >
          <Camera className="size-6 text-white" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {/* Name / email / remove button */}
      <div className="flex flex-col gap-1 min-w-0">
        {displayName && (
          <p className="text-foreground font-semibold text-lg truncate">
            {displayName}
          </p>
        )}
        <p className="text-muted-foreground text-sm truncate">{email}</p>

        {avatarUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="mt-1 w-fit text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 px-2 h-7"
          >
            <Trash2 className="size-3.5" />
            Remove photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarSection;
