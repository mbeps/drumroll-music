"use client";

import { useEffect, useState } from "react";
import { ProductWithPrice } from "@/types/types";
import AuthModal from "@/components/Modals/AuthModal";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Prevents errors in server side rendering.
   * Modal can cause hydration errors.
   * Do not render modal if rendering on the server.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
    </>
  );
};

export default ModalProvider;
