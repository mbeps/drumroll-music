import { redirect } from "next/navigation";
import { GetPasskeys } from "@/actions/auth/get-passkeys";
import { getStorageUsage } from "@/actions/storage/get-storage-usage";
import getUserProfile from "@/actions/user/get-user-profile";
import AccountContent from "@/components/account/account-content";
import Header from "@/components/header";
import { ROUTES } from "@/routes";

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
      <AccountContent profile={result.profile} passkeys={passkeys} storage={storage} />
    </>
  );
};

export default AccountPage;
