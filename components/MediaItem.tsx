"use client";

import Image from "next/image";

import useLoadImage from "@/hooks/useLoadImage";
import type { SongWithAlbum } from "../types/song-with-album";
import { formatArtists } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

interface MediaItemProps {
  song: SongWithAlbum;
  onClick?: (id: number) => void;
  children?: React.ReactNode;
}

/**
 * A versatile list-item component for representing songs in various contexts.
 * Commonly used in the active playback queue, playlist lists, and search results.
 * Supports child components for custom right-side actions.
 *
 * @author Maruf Bepary
 * @param song The song data to display.
 * @param onClick Optional interaction handler (defaults to playback).
 * @param children Optional UI elements for the item's action area.
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
        <Image
          fill
          sizes="48px"
          src={imageUrl || "/images/music-placeholder.png"}
          alt="MediaItem"
          className="object-cover"
        />
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
