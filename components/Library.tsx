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
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="
            text-neutral-400 
            cursor-pointer 
            hover:text-red-500
            transition
          "
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <MediaItem
            key={song.id}
            onClick={(id: string) => {
              onPlay(id);
            }}
            song={song}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
