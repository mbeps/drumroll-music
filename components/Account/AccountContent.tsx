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

/**
 * Props for AccountContent.
 */
interface AccountContentProps {
  /** Combined user profile from auth and `public.users`, as returned by `getUserProfile`. */
  profile: UserProfile;
  /** Initial list of passkeys registered for the current user. */
  passkeys: PasskeyFactor[];
}

/**
 * Top-level account settings layout rendered on the `/account` page.
 * Shows the avatar section followed by a tabbed interface (Profile / Security).
 *
 * @author Maruf Bepary
 */
const AccountContent: React.FC<AccountContentProps> = ({ profile, passkeys }) => {
  return (
    <div className="px-6 py-4 max-w-2xl">
      <AvatarSection
        avatarUrl={profile.avatar_url ?? null}
        displayName={profile.full_name ?? null}
        email={profile.email}
      />

      <Separator className="my-8" />

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
