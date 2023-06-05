"use client";

import { useEffect, useState } from "react";
import { ProductWithPrice } from "@/types/types";
import AuthModal from "@/components/Modals/AuthModal";
import UploadModal from "@/components/Modals/UploadModal";

/**
 * Responsible for rendering authentication and upload modals.
 * It prevents errors in server-side rendering by ensuring that modals are only rendered on the client side (modals can cause hydration errors).
 *
 * @param {ModalProviderProps}
 * @returns (JSX.Element): provider for all modals
 */
const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Prevents errors in server side rendering.
   * Modal can cause hydration errors.
   * Do not render modal if rendering on the server.
   */
  useEffect(() => {
    setIsMounted(true); // render modals on the client
  }, []);

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
