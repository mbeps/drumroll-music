"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { RenamePasskey } from "@/actions/auth/rename-passkey";
import { DeletePasskey } from "@/actions/auth/delete-passkey";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PasskeyFactor } from "@/types/passkey";
import { PasskeyRenameSchema, type PasskeyRenameInput } from "@/schemas/auth/passkey-rename.schema";

/**
 * Individual row for a registered passkey with rename and delete actions.
 * Displays passkey name and registration date with self-contained controls.
 *
 * @author Maruf Bepary
 */

interface PasskeyItemProps {
  passkey: PasskeyFactor;
}

/**
 * Individual row for a registered passkey.
 * Displays the passkey's name and registration date.
 * Provides self-contained actions for renaming or deleting the passkey
 * using the Supabase Auth API wrapped in server actions.
 *
 * @author Maruf Bepary
 */
export const PasskeyItem: React.FC<PasskeyItemProps> = ({ passkey }) => {
  const [isPending, startTransition] = useTransition();
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasskeyRenameInput>({
    resolver: zodResolver(PasskeyRenameSchema),
    defaultValues: {
      passkeyId: passkey.id,
      newName: passkey.friendly_name ?? "",
    },
  });

  /** Updates the passkey name using Supabase Auth. */
  const onRename = (data: PasskeyRenameInput) => {
    startTransition(async () => {
      try {
        const success = await RenamePasskey(data.passkeyId, data.newName);

        if (!success) throw new Error("Failed to rename passkey");

        toast.success("Passkey renamed successfully");
        setIsRenameOpen(false);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to rename passkey";
        toast.error(message);
      }
    });
  };

  /** Deletes/revokes the passkey using Supabase Auth. */
  const onDelete = () => {
    startTransition(async () => {
      try {
        const success = await DeletePasskey(passkey.id);

        if (!success) throw new Error("Failed to revoke passkey");

        toast.success("Passkey revoked");
        setIsDeletingOpen(false);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to revoke passkey";
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-muted-foreground/10">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Fingerprint size={20} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">
            {passkey.friendly_name || "Unnamed Passkey"}
          </span>
          <span className="text-xs text-muted-foreground">
            Added on {format(new Date(passkey.created_at), "PPP")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Popover open={isRenameOpen} onOpenChange={setIsRenameOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              title="Rename passkey"
              onClick={() => reset({ passkeyId: passkey.id, newName: passkey.friendly_name ?? "" })}
              disabled={isPending}
            >
              <Pencil size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleSubmit(onRename)} className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Rename Passkey</h4>
                <p className="text-sm text-muted-foreground">
                  Update the friendly name for this passkey.
                </p>
              </div>
              <div className="space-y-1">
                <Input
                  {...register("newName")}
                  placeholder="e.g. My Secure Key"
                  disabled={isPending}
                  autoFocus
                />
                {errors.newName && (
                  <p className="text-xs text-destructive">
                    {errors.newName.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRenameOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 animate-spin" size={12} />
                  ) : null}
                  {isPending ? "Saving..." : "Rename"}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>

        <Dialog open={isDeletingOpen} onOpenChange={setIsDeletingOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              title="Delete passkey"
              disabled={isPending}
            >
              <Trash2 size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Passkey</DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke <span className="font-semibold text-foreground">&quot;{passkey.friendly_name || "Unnamed Passkey"}&quot;</span>? 
                This action cannot be undone, and you will need to register it again to use it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setIsDeletingOpen(false)}
                disabled={isPending}
              >
                Keep Passkey
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : null}
                {isPending ? "Revoking..." : "Revoke Passkey"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
