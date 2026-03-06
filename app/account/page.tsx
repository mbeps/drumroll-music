import Header from "@/components/Header";
import PageMessage from "@/components/PageMessage";

export const revalidate = 0; // page will not be cached

/**
 * Account page component.
 * Displays a placeholder for user account settings and profile information.
 */
export default function AccountPage() {
  return (
    <>
      <Header heading="Account" />
      <PageMessage
        title="Account"
        description="This feature has not been implemented yet"
      />
    </>
  );
}
