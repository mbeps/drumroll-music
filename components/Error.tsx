"use client";

import PageMessage from "./PageMessage";

/**
 * Error message component to be displayed on error pages.
 * Provides a standardized visual feedback for unexpected application failures.
 * This component utilizes `PageMessage` to deliver a consistent user experience during error states.
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
