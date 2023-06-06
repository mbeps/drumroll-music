"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BiSearch, BiHomeAlt2 } from "react-icons/bi";
import Box from "../Box";
import SidebarItem from "./SidebarItem";
import Library from "../Library";
import { Song } from "@/types/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

/**
 * The sidebar of the app.
 * The sidebar contains the navigation and the side content.
 * The sidebar allows users to navigate to:
 * - Home: the home page
 * - Search: the search page
 * The sidebar also displays library of the user (songs that the user has uploaded).
 * It also contains the button to upload a song.
 * The sidebar is hidden on mobile devices.
 * @param {children}: content of the app
 * @returns (React.ReactNode): sidebar and side content
 */
const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname(); // used to determine the current route
  const player = usePlayer(); // used to change the size of sidebar if there is player

  /**
   * The routes of the sidebar.
   * The routes are used to render the sidebar items.
   * The current route is determined by the pathname hence it will be highlighted.
   * Each route has an icon, label, href and active.
   * This is memoized to prevent unnecessary re-renders.
   */
  const routes = useMemo(
    () => [
      {
        icon: BiHomeAlt2,
        label: "Home",
        active: pathname !== "/search",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        href: "/search",
        active: pathname === "/search",
      },
    ],
    [pathname]
  );

  return (
    <div
      className={twMerge(
        `
        flex 
        h-full
        `,
        player.activeId && "h-[calc(100%-80px)]"
      )}
    >
      <div
        className="hidden 
          md:flex 
          flex-col 
          gap-y-2 
          bg-black 
          h-full 
          w-[300px] 
          p-2"
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto md:py-2 md:pr-2">
        <div
          className="
        bg-neutral-900 
        md:rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
        >
          {children}
        </div>
      </main>
    </div>
  );
};
export default Sidebar;
