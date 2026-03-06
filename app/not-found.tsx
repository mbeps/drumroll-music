import PageMessage from "@/components/PageMessage";

export const revalidate = 0; // page will not be cached

/**
 * Page component rendered when a requested route is not found (404).
 */
export default function NotFound() {
  return (
    <>
      <PageMessage
        title="404: Page Not Found"
        description="This page does not exist. Try navigating to a different page."
      />
    </>
  );
}
