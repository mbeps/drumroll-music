"use client";

import { useSyncExternalStore } from "react";
import AuthModal from "@/components/Modals/AuthModal";
import UploadModal from "@/components/Modals/UploadModal";

const emptySubscribe = () => () => {};

/**
 * Responsible for rendering authentication and upload modals.
 * It prevents errors in server-side rendering by ensuring that modals are only rendered on the client side (modals can cause hydration errors).
 *
 * @param {ModalProviderProps}
 * @returns (JSX.Element): provider for all modals
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
      <UploadModal />
    </>
  );
};

export default ModalProvider;
