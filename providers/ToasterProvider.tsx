"use client";

import { Toaster } from "react-hot-toast";

/**
 * Allows for toast notifications to be accessible to all components in the tree.
 *
 * @returns (JSX.Element): provider for toast notifications
 */
const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
          accentColor: "#ff0000",
        },
      }}
    />
  );
};

export default ToasterProvider;
