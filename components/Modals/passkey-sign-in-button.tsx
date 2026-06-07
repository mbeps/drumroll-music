"use client";

import { useState, useEffect } from "react";
import { Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

interface PasskeySignInButtonProps {
  disabled?: boolean;
}

/**
 * A button component that triggers the Supabase Passkey (WebAuthn) sign-in flow.
 * It only renders if the browser supports WebAuthn.
 * 
 * @author Maruf Bepary
 */
export const PasskeySignInButton: React.FC<PasskeySignInButtonProps> = ({ disabled }) => {
  const supabaseClient = useSupabaseClient();
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for browser support on mount
    const checkSupport = async () => {
      const supported =
        window.PublicKeyCredential &&
        (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
      setIsSupported(!!supported);
    };
    checkSupport();
  }, []);

  const handlePasskeySignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabaseClient.auth.signInWithPasskey();
      
      if (error) {
        throw error;
      }
      
      toast.success("Signed in with passkey!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in with passkey.";
      
      // Specifically handle the case where the user cancels the passkey prompt
      if (message.includes("cancelled") || message.includes("abort")) {
        return;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={handlePasskeySignIn}
      className="flex items-center justify-center gap-x-2 rounded-xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Fingerprint size={18} />
      Sign in with Passkey
    </button>
  );
};
