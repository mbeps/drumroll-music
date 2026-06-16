"use client";

import { User, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import type { UserProfile } from "@/actions/getUserProfile";
import type { PasskeyFactor } from "@/types/passkey";
import AvatarSection from "./AvatarSection";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import { PasskeyManager } from "./passkey-manager";
import StorageMeter from "./StorageMeter";
import type { StorageUsageResult } from "@/actions/getStorageUsage";

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
 * Top-level account settings layout rendered on the `/account` page.
 * Shows the avatar section followed by a tabbed interface (Profile / Security).
 *
 * @author Maruf Bepary
 */
const AccountContent: React.FC<AccountContentProps> = ({ 
  profile, 
  passkeys, 
  storage 
}) => {
  return (
    <div className="px-6 py-4 max-w-2xl flex flex-col gap-y-8">
      <AvatarSection
        avatarUrl={profile.avatar_url ?? null}
        displayName={profile.full_name ?? null}
        email={profile.email}
      />

      <StorageMeter 
        usage={storage.userUsage} 
        limit={storage.userLimit} 
      />

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
