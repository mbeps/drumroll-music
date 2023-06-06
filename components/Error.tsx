"use client";

import PageMessage from "./PageMessage";

/**
 * Error message component to be displayed on error pages.
 * @returns (React.ReactNode): the error message
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
