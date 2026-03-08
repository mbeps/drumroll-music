"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/actions/getUserProfile";
import updateUserProfile from "@/actions/updateUserProfile";

/**
 * Props for ProfileForm.
 */
interface ProfileFormProps {
  /** The user's current profile, used to pre-fill the display name and show read-only info. */
  profile: UserProfile;
}

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email / Password",
  github: "GitHub",
  google: "Google",
};

/**
 * Form for editing the user's display name.
 * Email and sign-in method are shown read-only for context — neither can be changed here.
 * Calls `updateUserProfile` on submit and refreshes the page on success.
 *
 * @author Maruf Bepary
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();

    if (!trimmed) {
      setError("Name is required");
      return;
    }
    if (trimmed.length > 100) {
      setError("Name must be 100 characters or fewer");
      return;
    }

    setError(null);

    startTransition(async () => {
      const success = await updateUserProfile({ fullName: trimmed });
      if (success) {
        toast.success("Profile updated");
        router.refresh();
      } else {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Display name */}
      <div className="space-y-2">
        <Label htmlFor="full-name">Display name</Label>
        <Input
          id="full-name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Your display name"
          maxLength={100}
          disabled={isPending}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      {/* Email — read-only */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={profile.email}
          readOnly
          disabled
          className="opacity-60 cursor-not-allowed"
        />
        <p className="text-muted-foreground text-xs">
          Email address cannot be changed
        </p>
      </div>

      {/* Sign-in method badge */}
      <div className="space-y-2">
        <Label>Sign-in method</Label>
        <div>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {PROVIDER_LABELS[profile.provider] ?? profile.provider}
          </span>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
