"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import Modal from "./Modal";

/**
 * Authentication modal which allows the user to authenticate or reset password.
 * Users can authenticate using several providers:
 * - Email and password
 * - Third-party providers (GitHub, Google)
 * This is fully handled by the Auth UI library and Supabase.
 *
 * @returns (JSX.Element): auth modal component
 */
const AuthModal = () => {
  const { session } = useSessionContext();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (session) {
      // If the user is logged in, refresh the page and close the modal
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  /**
   * Toggles the modal state (open/closed).
   *
   * @param open (boolean): whether the modal is open or not
   */
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Log In"
      description="Log into your account using email and password or a provider"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        supabaseClient={supabaseClient}
        providers={["github", "google"]}
        magicLink={false}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#ff0000",
              },
            },
          },
          className: {
            button: "rounded-xl",
          },
        }}
        theme="dark"
      />
    </Modal>
  );
};

export default AuthModal;
