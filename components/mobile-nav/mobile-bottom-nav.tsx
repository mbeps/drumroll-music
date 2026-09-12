"use client";

/**
 * Mobile bottom navigation bar with primary routes and expandable menu.
 * Displays quick-access links (Home, Search, Playlists) in the nav bar.
 * Drawer exposes secondary routes (Songs, Albums, Artists, Favourites) and user menu.
 * Includes authentication controls (sign in/up/logout) within the drawer.
 * Hidden on medium and larger screens where Sidebar is used instead.
 *
 * @author Maruf Bepary
 */

import { LogOut, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiHomeAlt2, BiSearch } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { RiAlbumLine, RiPlayListLine } from "react-icons/ri";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/config/routes";
import useAuthModal from "@/hooks/use-auth-modal";
import useUser from "@/hooks/use-user";
import { getInitials } from "@/lib/avatar/get-initials";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from "@/providers/supabase-provider";

const NAV_ITEMS = [
  { icon: BiHomeAlt2, label: "Home", href: ROUTES.HOME.path },
  { icon: BiSearch, label: "Search", href: ROUTES.SEARCH.path },
  { icon: RiPlayListLine, label: "Playlists", href: ROUTES.PLAYLISTS.path },
];

const MORE_ITEMS = [
  { icon: HiOutlineMusicalNote, label: "Songs", href: ROUTES.SONGS.path },
  { icon: RiAlbumLine, label: "Albums", href: ROUTES.ALBUMS.path },
  { icon: BsPeople, label: "Artists", href: ROUTES.ARTISTS.path },
  { icon: AiOutlineHeart, label: "Favourites", href: ROUTES.FAVOURITES.path },
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
    <div className="fixed right-0 bottom-0 left-0 z-40 border-border border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
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
              "flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
              isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
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
                    <Avatar className="h-12 w-12 shrink-0 rounded-lg border border-border">
                      <AvatarImage src={userDetails?.avatar_url || ""} alt={displayName} />
                      <AvatarFallback className="rounded-lg text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-base">{displayName}</p>
                      <p className="truncate text-muted-foreground text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex w-full gap-2 px-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push(ROUTES.ACCOUNT.path);
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
                <div className="flex w-full gap-2 px-1">
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

            <div className="space-y-1 px-4 pb-6">
              {MORE_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 font-medium text-sm transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
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
