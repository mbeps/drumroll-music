"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import type { SongWithAlbum } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import { formatArtists } from "@/lib/utils";
import PlayButton from "./PlayButton";
import SongOptionsMenu from "./SongOptionsMenu";
import { Button } from "./ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface SongItemProps {
  data: SongWithAlbum;
  onClick: (id: number) => void;
  priority?: boolean;
  rightAction?: React.ReactNode;
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
const SongItem: React.FC<SongItemProps> = ({
  data,
  onClick,
  priority = false,
  rightAction,
}) => {
  const imagePath = useLoadImage(data.album.coverImagePath);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        max-sm:flex-row
        max-sm:items-center
        max-sm:pr-4
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
      <div
        className="
          relative 
          w-full h-auto aspect-square
          max-sm:w-16 max-sm:h-16 max-sm:aspect-auto max-sm:shrink-0
          rounded-lg 
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePath || "/images/music-placeholder.png"}
          fill
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 12.5vw"
          alt="Image"
          priority={priority}
        />
      </div>
      <ItemContent className="flex flex-col items-start w-full pt-4 max-sm:pt-0 gap-y-1">
        <ItemTitle className="font-semibold text-lg truncate w-full">
          {data.title}
        </ItemTitle>
        <ItemDescription
          className="
            text-muted-foreground 
            text-sm 
            pb-4
            max-sm:pb-0
            w-full 
            truncate
          "
        >
          By {formatArtists(data.album)}
        </ItemDescription>
      </ItemContent>

      <div className="flex items-center gap-x-2 shrink-0">
        {rightAction}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            setDrawerOpen(true);
          }}
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </div>

      <div
        className="
          max-sm:hidden
          absolute 
          bottom-24 
          right-5
        "
      >
        <PlayButton />
      </div>
      <SongOptionsMenu
        songId={data.id}
        song={data}
        drawerOpen={drawerOpen}
        onDrawerOpenChange={setDrawerOpen}
      />
    </Item>
  );
};

export default SongItem;
