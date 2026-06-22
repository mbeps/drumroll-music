"use client";

import { ListMusic } from "lucide-react";

import type { Playlist } from "../types/playlist/playlist";
import {
  Item,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

/**
 * List item component for displaying a user-created playlist.
 * Used in sidebars, dropdowns, and navigation menus for quick access to playlists.
 *
 * @author Maruf Bepary
 */

interface PlaylistItemProps {
  /** The playlist entity data to display. */
  data: Playlist;
  /** Optional callback invoked with the playlist ID when the item is clicked. */
  onClick?: (id: string) => void;
}

/**
 * Renders a single playlist as a list item with icon and title.
 *
 * @param props - See PlaylistItemProps
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
