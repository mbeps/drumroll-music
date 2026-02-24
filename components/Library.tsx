"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types/types";
import React from "react";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface LibraryProps {
  songs: Song[];
}

/**
 * Displays a list of songs that the user has uploaded with a button to upload more songs.
 *
 * @param songs (Song[]): list of songs to be displayed
 * @returns (React.FC): Library component with songs inside
 */
const Library: React.FC<LibraryProps> = ({ songs }) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const onPlay = useOnPlay(songs);

  /**
   * Tries to open the upload modal if the user is logged in.
   * Otherwise, opens the auth modal.
   *
   * @returns (() => void): function to be called when the button is clicked
   */
  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between group/label">
        <div className="inline-flex items-center gap-x-2 w-full">
          <TbPlaylist className="text-muted-foreground" size={20} />
          <p className="text-muted-foreground font-medium">Your Library</p>
        </div>
        <button
          onClick={onClick}
          className="
            text-muted-foreground 
            cursor-pointer 
            hover:text-foreground
            transition
            p-1
            rounded-full
            hover:bg-sidebar-accent
          "
        >
          <AiOutlinePlus size={16} />
        </button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {songs.map((song) => (
            <SidebarMenuItem key={song.id}>
              <MediaItem
                onClick={(id: string) => {
                  onPlay(id);
                }}
                song={song}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default Library;
