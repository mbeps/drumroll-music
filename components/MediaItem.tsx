"use client";

import Image from "next/image";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types/types";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

interface MediaItemProps {
  song: Song;
  onClick?: (id: string) => void;
  children?: React.ReactNode;
}

/**
 * Displays a card for a song.
 * The card displays:
 * - the song image
 * - the song title
 * - the song author
 * - a play button on hover
 * Normally, clicking on the card will play the song.
 *
 * @param song (Song): song object/data
 * @param onClick (function): function to be called when the item is clicked
 * @param children (React.ReactNode): optional children elements (e.g. actions)
 * @returns (React.ReactNode): the item (image, title, author and play button)
 */
const MediaItem: React.FC<MediaItemProps> = ({ song, onClick, children }) => {
  const imageUrl = useLoadImage(song);

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
      className="
        flex 
        items-center 
        gap-x-3 
        cursor-pointer 
        bg-neutral-100/40
        hover:bg-neutral-100/80
        transition
        w-full 
        p-2 
        rounded-lg
      "
    >
      <div
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
          src={imageUrl || "/images/music-placeholder.png"}
          alt="MediaItem"
          className="object-cover"
        />
      </div>
      <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
        <ItemTitle className="text-foreground truncate">{song.title}</ItemTitle>
        <ItemDescription className="text-muted-foreground text-sm truncate">
          By {song.author}
        </ItemDescription>
      </ItemContent>
      {children && <ItemActions>{children}</ItemActions>}
    </Item>
  );
};

export default MediaItem;
