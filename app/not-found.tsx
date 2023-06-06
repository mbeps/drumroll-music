"use client";

import PageMessage from "@/components/PageMessage";

export const revalidate = 0; // page will not be cached

/**
 * Rendered when the user navigates to a page that does not exist.
 * Displays a 404 error message saying that the page does not exist.
 *
 * @returns (React.FC): PageMessage component with a 404 error message
 */
export default async function NotFound() {
  return (
    <>
      <PageMessage
        title="404: Page Not Found"
        description="This page does not exist. Try navigating to a different page."
      />
    </>
  );
}
