"use client";

import Image from "next/image";

import { Song } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import PlayButton from "./PlayButton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface SongItemProps {
  data: Song;
  onClick: (id: number) => void;
  priority?: boolean;
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
 * @param data (Song): song object/data
 * @param onClick (function): function to be called when the item is clicked
 * @returns (React.ReactNode): the item (image, title, author and play button)
 */
const SongItem: React.FC<SongItemProps> = ({ data, onClick, priority = false }) => {
  const imagePath = useLoadImage(data);

  return (
    <Item
      onClick={() => onClick(data.id)}
      variant="muted"
      size="sm"
      className="
        relative 
        group 
        flex 
        flex-col 
        items-start
        rounded-lg
        gap-x-3 
        cursor-pointer 
        border border-border
        bg-muted/60
        hover:bg-muted
        transition 
        p-2
      "
    >
      <AspectRatio
        ratio={1 / 1}
        className="
          relative 
          w-full
          rounded-lg 
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePath || "/images/music-placeholder.png"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 12.5vw"
          alt="Image"
          priority={priority}
        />
      </AspectRatio>
      <ItemContent className="flex flex-col items-start w-full pt-4 gap-y-1">
        <ItemTitle className="font-semibold text-lg truncate w-full">
          {data.title}
        </ItemTitle>
        <ItemDescription
          className="
            text-muted-foreground 
            text-sm 
            pb-4 
            w-full 
            truncate
          "
        >
          By {data.author}
        </ItemDescription>
      </ItemContent>
      <div
        className="
          absolute 
          bottom-24 
          right-5
        "
      >
        <PlayButton />
      </div>
    </Item>
  );
};

export default SongItem;
