"use client";

import { useSyncExternalStore } from "react";
import AuthModal from "@/components/modals/auth-modal";

const emptySubscribe = () => () => {};

/**
 * @fileoverview Renders authentication modals on the client side only.
 * Prevents hydration errors by deferring modal rendering until after client-side mount.
 *
 * @author Maruf Bepary
 * @see SupabaseProvider
 * @see UserProvider
 */

/**
 * Mounts authentication modals safely on the client side only.
 * Uses `useSyncExternalStore` to detect mount status and prevent server-side hydration mismatches.
 *
 * @returns Modal provider component wrapping AuthModal.
 */
const ModalProvider: React.FC = () => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    // Do not render modals on the server
    return null;
  }

  return (
    <>
      <AuthModal />
    </>
  );
};

export default ModalProvider;
