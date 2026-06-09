import { redirect } from "next/navigation";

import { ROUTES } from "@/routes";
import getUserProfile from "@/actions/getUserProfile";
import { GetPasskeys } from "@/actions/get-passkeys";
import { getStorageUsage } from "@/actions/getStorageUsage";
import Header from "@/components/Header";
import AccountContent from "@/components/Account/AccountContent";

export const revalidate = 0;

/**
 * Account settings page — Next.js server component.
 * Fetches the authenticated user's profile and passkeys, then passes them to `AccountContent`.
 * Redirects to `/` if the user is unauthenticated.
 *
 * @author Maruf Bepary
 */
const AccountPage = async () => {
  const [result, passkeys, storage] = await Promise.all([
    getUserProfile(),
    GetPasskeys(),
    getStorageUsage(),
  ]);

  if (!result) redirect(ROUTES.HOME.path);

  return (
    <>
      <Header heading="Account" />
      <AccountContent 
        profile={result.profile} 
        passkeys={passkeys} 
        storage={storage}
      />
    </>
  );
};

export default AccountPage;
