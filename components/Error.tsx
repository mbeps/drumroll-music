"use client";

import PageMessage from "./PageMessage";

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
