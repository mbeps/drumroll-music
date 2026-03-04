"use client";

import { useSyncExternalStore } from "react";
import AuthModal from "@/components/Modals/AuthModal";

const emptySubscribe = () => () => {};

/**
 * Responsible for rendering authentication modals.
 * It prevents errors in server-side rendering by ensuring that modals are only rendered on the client side (modals can cause hydration errors).
 *
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
    </>
  );
};

export default ModalProvider;
