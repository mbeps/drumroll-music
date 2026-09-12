"use client";

import { Lock, User } from "lucide-react";
import AvatarSection from "@/app/account/_components/avatar-section";
import { PasskeyManager } from "@/app/account/_components/passkey-manager";
import PasswordForm from "@/app/account/_components/password-form";
import ProfileForm from "@/app/account/_components/profile-form";
import StorageMeter from "@/app/account/_components/storage-meter";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PasskeyFactor } from "@/types/auth/passkey";
import type { StorageUsageResult } from "@/types/storage/storage-usage-result";
import type { UserProfile } from "@/types/user/user-profile";

/**
 * Props for AccountContent.
 */
interface AccountContentProps {
  /** Combined user profile from auth and `public.users`, as returned by `getUserProfile`. */
  profile: UserProfile;
  /** Initial list of passkeys registered for the current user. */
  passkeys: PasskeyFactor[];
  /** Current global storage usage and limit. */
  storage: StorageUsageResult;
}

/**
 * Renders the account settings page layout with tabbed interface.
 *
 * @param props - See AccountContentProps
 * @author Maruf Bepary
 */
const AccountContent: React.FC<AccountContentProps> = ({ profile, passkeys, storage }) => {
  return (
    <div className="flex max-w-2xl flex-col gap-y-8 px-6 py-4">
      <AvatarSection
        avatarUrl={profile.avatar_url ?? null}
        displayName={profile.full_name ?? null}
        email={profile.email}
      />

      <StorageMeter usage={storage.userUsage} limit={storage.userLimit} />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User size={15} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock size={15} />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm profile={profile} />
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-8">
          {profile.canChangePassword && (
            <>
              <PasswordForm />
              <Separator />
            </>
          )}
          <PasskeyManager initialPasskeys={passkeys} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountContent;
