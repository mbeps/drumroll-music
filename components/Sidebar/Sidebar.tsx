"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BiSearch, BiHomeAlt2 } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { RiAlbumLine, RiPlayListLine } from "react-icons/ri";
import { BsPeople } from "react-icons/bs";
import Link from "next/link";
import { ROUTES } from "@/routes";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarProfile from "./SidebarProfile";

/**
 * Primary desktop navigation sidebar for the application.
 * Renders a fixed vertical nav with links to all main routes (Home, Search,
 * Songs, Albums, Artists, Playlists, Favourites). Highlights the active route
 * using path-based comparison. Includes SidebarProfile in the footer for
 * user account and authentication actions.
 * Only visible on medium and larger screens; mobile navigation is handled
 * by MobileBottomNav.
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
    [pathname]
  );

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold tracking-tight">Drumroll Music</h2>
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
