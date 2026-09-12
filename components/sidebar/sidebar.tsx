"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiHomeAlt2, BiSearch } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { RiAlbumLine, RiPlayListLine } from "react-icons/ri";
import SidebarProfile from "@/components/sidebar/sidebar-profile";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/config/routes";

/**
 * Desktop navigation sidebar with main application routes.
 * Displays navigation links (Home, Search, Songs, Albums, Artists, Playlists, Favourites).
 * Includes active route highlighting and a profile/auth section in the footer.
 * Hidden on small screens; MobileBottomNav provides mobile navigation.
 *
 * @author Maruf Bepary
 */
const Sidebar = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: BiHomeAlt2,
        label: "Home",
        active: pathname === ROUTES.HOME.path,
        href: ROUTES.HOME.path,
      },
      {
        icon: BiSearch,
        label: "Search",
        href: ROUTES.SEARCH.path,
        active: pathname === ROUTES.SEARCH.path,
      },
      {
        icon: HiOutlineMusicalNote,
        label: "Songs",
        href: ROUTES.SONGS.path,
        active: pathname === ROUTES.SONGS.path,
      },
      {
        icon: RiAlbumLine,
        label: "Albums",
        href: ROUTES.ALBUMS.path,
        active: pathname === ROUTES.ALBUMS.path,
      },
      {
        icon: BsPeople,
        label: "Artists",
        href: ROUTES.ARTISTS.path,
        active: pathname === ROUTES.ARTISTS.path,
      },
      {
        icon: RiPlayListLine,
        label: "Playlists",
        href: ROUTES.PLAYLISTS.path,
        active: pathname === ROUTES.PLAYLISTS.path,
      },
      {
        icon: AiOutlineHeart,
        label: "Favourites",
        href: ROUTES.FAVOURITES.path,
        active: pathname === ROUTES.FAVOURITES.path,
      },
    ],
    [pathname],
  );

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center px-4 pt-4 pb-2">
          <h2 className="font-bold text-xl tracking-tight">Drumroll Music</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarProfile />
    </ShadcnSidebar>
  );
};
export default Sidebar;
