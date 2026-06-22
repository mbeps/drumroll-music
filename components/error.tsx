"use client";

import PageMessage from "./page-message";

/**
 * Error fallback component for catching and displaying unhandled errors.
 * Renders a user-friendly error message via PageMessage to inform users of unexpected failures.
 * Typically used in error boundaries at the root or route level.
 *
 * @author Maruf Bepary
 */
const ErrorMessage = () => {
  return (
    <>
      <PageMessage
        title="Something went wrong"
        description="There has been an unknown error. More info in the Dev console."
      />
    </>
  );
};

export default ErrorMessage;
