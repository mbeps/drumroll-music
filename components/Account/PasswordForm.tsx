"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import updateUserPassword from "@/actions/updateUserPassword";

/**
 * Form for changing the user's password.
 * Only rendered for accounts with an email/password identity.
 * Calls `updateUserPassword` which re-authenticates with the current password before applying the change.
 *
 * @author Maruf Bepary
 */
const PasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await updateUserPassword({ currentPassword, newPassword });
      if (result.success) {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(result.error ?? "Failed to update password");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Current password */}
      <div className="space-y-2">
        <Label htmlFor="current-password">Current password</Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              clearError();
            }}
            placeholder="Enter current password"
            disabled={isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* New password */}
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              clearError();
            }}
            placeholder="Min. 8 characters"
            disabled={isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError();
            }}
            placeholder="Repeat new password"
            disabled={isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
};

export default PasswordForm;
