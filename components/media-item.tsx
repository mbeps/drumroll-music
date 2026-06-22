"use client";

import Image from "next/image";
import { Music } from "lucide-react";

import useLoadImage from "@/hooks/use-load-image";
import type { SongWithAlbum } from "../types/music/song-with-album";
import { formatArtists } from "@/lib/music/format-artists";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

/**
 * Media item card for displaying a song in lists and queues.
 * Shows album cover, title, and formatted artist names with optional right-side actions.
 * Used in the playback queue, playlists, and search results.
 *
 * @author Maruf Bepary
 */

interface MediaItemProps {
  /** The song object including nested album metadata. */
  song: SongWithAlbum;
  /** Optional callback invoked with song ID when the item is clicked (typically triggers playback). */
  onClick?: (id: number) => void;
  /** Optional UI elements to render in the right action area (e.g., buttons, menus). */
  children?: React.ReactNode;
}

/**
 * Renders a song list item with cover art, title, artists, and optional actions.
 *
 * @param props - See MediaItemProps
 * @author Maruf Bepary
 */
const MediaItem: React.FC<MediaItemProps> = ({ song, onClick, children }) => {
  const imageUrl = useLoadImage(song.album.coverImagePath);

  /**
   * Handles the click event on the item.
   * Checks if the onClick function exists and calls it.
   * @returns (void): calls the onClick function if it exists
   */
  const handleClick = () => {
    if (onClick) {
      return onClick(song.id);
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
      <AspectRatio
        ratio={1 / 1}
        className="
          relative 
          rounded-lg 
          min-h-[48px] 
          min-w-[48px] 
          overflow-hidden
        "
      >
        {imageUrl ? (
          <Image
            fill
            sizes="48px"
            src={imageUrl}
            alt="MediaItem"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Music className="text-muted-foreground size-1/2" />
          </div>
        )}
      </AspectRatio>
      <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
        <ItemTitle className="text-foreground truncate">{song.title}</ItemTitle>
        <ItemDescription className="text-muted-foreground text-sm truncate">
          By {formatArtists(song.album)}
        </ItemDescription>
      </ItemContent>
      {children && <ItemActions>{children}</ItemActions>}
    </Item>
  );
};

export default MediaItem;
