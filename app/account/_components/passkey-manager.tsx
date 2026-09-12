"use client";

import { AlertCircle, Fingerprint, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PasskeyItem } from "@/app/account/_components/passkey-item";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@/providers/supabase-provider";
import type { PasskeyFactor } from "@/types/auth/passkey";

/**
 * Container for managing user's registered passkeys (WebAuthn credentials).
 * Lists existing passkeys and provides registration of new ones.
 * Delegates rename/delete operations to PasskeyItem child components.
 *
 * @author Maruf Bepary
 */

interface PasskeyManagerProps {
  initialPasskeys: PasskeyFactor[];
}

/**
 * Manages the user's registered passkeys.
 * Allows listing, registering new ones, and delegating rename/delete to PasskeyItem.
 *
 * @author Maruf Bepary
 */
export const PasskeyManager = ({ initialPasskeys }: PasskeyManagerProps) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  /** Checks if the browser/device supports WebAuthn (Passkeys). */
  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        window.PublicKeyCredential &&
        (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
      setIsSupported(!!supported);
    };
    checkSupport();
  }, []);

  /** Initiates the passkey registration flow. */
  const onRegister = async () => {
    setIsRegistering(true);
    try {
      const { error } = await supabase.auth.registerPasskey();

      if (error) throw error;

      toast.success("Passkey registered successfully!");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name !== "NotAllowedError" && error.message !== "User cancelled") {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to register passkey");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Passkeys</h3>
        <p className="text-muted-foreground text-sm">
          Use passkeys to sign in to your account without a password.
        </p>
      </div>

      {isSupported === false && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-500">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">Your browser or device doesn&apos;t seem to support passkeys.</p>
        </div>
      )}

      <div className="space-y-4">
        {initialPasskeys.length > 0 ? (
          <div className="grid gap-3">
            {initialPasskeys.map((pk) => (
              <PasskeyItem key={pk.id} passkey={pk} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-muted-foreground/20 border-dashed py-10 text-muted-foreground">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/50">
              <Fingerprint size={24} />
            </div>
            <p className="font-medium text-foreground">No passkeys registered</p>
            <p className="text-sm">Add a passkey to secure your account.</p>
          </div>
        )}

        <Button
          onClick={onRegister}
          disabled={isRegistering || isSupported === false}
          className="w-full sm:w-auto"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Registering...
            </>
          ) : (
            <>
              <Plus className="mr-2" size={16} />
              Register Passkey
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
