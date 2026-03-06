"use client";

import { ListMusic } from "lucide-react";

import type { Playlist } from "../types/playlist";
import {
  Item,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

interface PlaylistItemProps {
  data: Playlist;
  onClick?: (id: string) => void;
}

/**
 * A list item representation for a user playlist.
 * Displays the playlist title and a generic list icon. Primarily used in 
 * sidebars and dropdown menus for quick selection or navigation.
 *
 * @param data - The configuration data for the playlist entity.
 * @param onClick - Optional handler to trigger selection or navigation by playlist ID.
 * @author Maruf Bepary
 */
const PlaylistItem: React.FC<PlaylistItemProps> = ({ data, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(data.id);
    }
  };

  return (
    <Item
      onClick={handleClick}
      size="sm"
      className="
        flex 
        items-center 
        gap-x-2 
        cursor-pointer 
        bg-muted/40
        hover:bg-muted/80
        transition
        w-full 
        p-2 
        rounded-lg
      "
    >
      <div
        className="
          flex 
          items-center 
          justify-center 
          min-h-[48px] 
          min-w-[48px] 
          rounded-lg 
          bg-muted
        "
      >
        <ListMusic className="size-5 text-muted-foreground" />
      </div>
      <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
        <ItemTitle className="text-foreground truncate">{data.title}</ItemTitle>
      </ItemContent>
    </Item>
  );
};

export default PlaylistItem;
