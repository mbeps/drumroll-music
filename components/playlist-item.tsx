"use client";

import { ListMusic } from "lucide-react";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import type { Playlist } from "../types/playlist/playlist";

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
      className="flex w-full cursor-pointer items-center gap-x-2 rounded-lg bg-muted/40 p-2 transition hover:bg-muted/80"
    >
      <div className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg bg-muted">
        <ListMusic className="size-5 text-muted-foreground" />
      </div>
      <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
        <ItemTitle className="truncate text-foreground">{data.title}</ItemTitle>
      </ItemContent>
    </Item>
  );
};

export default PlaylistItem;
