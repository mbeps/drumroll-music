import { redirect } from "next/navigation";

import getUserProfile from "@/actions/getUserProfile";
import Header from "@/components/Header";
import AccountContent from "@/components/Account/AccountContent";

export const revalidate = 0;

/**
 * Account settings page — Next.js server component.
 * Fetches the authenticated user's profile via `getUserProfile` and passes it to `AccountContent`.
 * Redirects to `/` if the user is unauthenticated.
 *
 * @author Maruf Bepary
 */
const AccountPage = async () => {
  const result = await getUserProfile();

  if (!result) redirect("/");

  return (
    <>
      <Header heading="Account" />
      <AccountContent profile={result.profile} />
    </>
  );
};

export default AccountPage;
