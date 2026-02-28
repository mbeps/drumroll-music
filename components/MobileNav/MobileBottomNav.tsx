"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BiHomeAlt2, BiSearch } from "react-icons/bi";
import { RiPlayListLine, RiAlbumLine } from "react-icons/ri";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { BsPeople } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { MoreHorizontal, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: BiHomeAlt2, label: "Home", href: "/" },
  { icon: BiSearch, label: "Search", href: "/search" },
  { icon: RiPlayListLine, label: "Playlists", href: "/playlists" },
];

const MORE_ITEMS = [
  { icon: HiOutlineMusicalNote, label: "Songs", href: "/songs" },
  { icon: RiAlbumLine, label: "Albums", href: "/albums" },
  { icon: BsPeople, label: "Artists", href: "/artists" },
  { icon: AiOutlineHeart, label: "Favourites", href: "/favourites" },
];

const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, userDetails } = useUser();
  const { onOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged Out");
      setOpen(false);
    }
  };

  const displayName = userDetails?.full_name || user?.email || "User";
  const initials = getInitials(displayName);
  const isMoreActive = MORE_ITEMS.some((item) => pathname.startsWith(item.href));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Drawer open={open} onOpenChange={setOpen}>
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs transition-colors",
              isMoreActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MoreHorizontal size={24} />
            <span>More</span>
          </button>

          <DrawerContent>
            <div className="px-4 pt-6 pb-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-2">
                    <Avatar className="h-12 w-12 rounded-lg shrink-0 border border-border">
                      <AvatarImage
                        src={userDetails?.avatar_url || ""}
                        alt={displayName}
                      />
                      <AvatarFallback className="rounded-lg text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate">
                        {displayName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full px-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push("/account");
                        setOpen(false);
                      }}
                      className="flex-1 font-medium"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex-1 font-medium text-destructive hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 w-full px-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpen();
                      setOpen(false);
                    }}
                    className="flex-1 font-medium"
                  >
                    Sign up
                  </Button>
                  <Button
                    onClick={() => {
                      onOpen();
                      setOpen(false);
                    }}
                    className="flex-1 font-medium"
                  >
                    Log in
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <div className="px-4 pb-6 space-y-1">
              {MORE_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default MobileBottomNav;
