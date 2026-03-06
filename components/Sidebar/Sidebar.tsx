"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BiSearch, BiHomeAlt2 } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { RiAlbumLine, RiPlayListLine } from "react-icons/ri";
import { BsPeople } from "react-icons/bs";
import Link from "next/link";
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
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        href: "/search",
        active: pathname === "/search",
      },
      {
        icon: HiOutlineMusicalNote,
        label: "Songs",
        href: "/songs",
        active: pathname === "/songs",
      },
      {
        icon: RiAlbumLine,
        label: "Albums",
        href: "/albums",
        active: pathname === "/albums",
      },
      {
        icon: BsPeople,
        label: "Artists",
        href: "/artists",
        active: pathname === "/artists",
      },
      {
        icon: RiPlayListLine,
        label: "Playlists",
        href: "/playlists",
        active: pathname === "/playlists",
      },
      {
        icon: AiOutlineHeart,
        label: "Favourites",
        href: "/favourites",
        active: pathname === "/favourites",
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
