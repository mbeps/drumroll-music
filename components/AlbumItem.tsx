"use client";

import Image from "next/image";

import type { AlbumWithArtists } from "../types/album-with-artists";
import useLoadImage from "@/hooks/useLoadImage";
import { formatArtists } from "@/lib/utils";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface AlbumItemProps {
  data: AlbumWithArtists;
  onClick: (id: string) => void;
  priority?: boolean;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ data, onClick, priority = false }) => {
  const imagePath = useLoadImage(data.coverImagePath);

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
          alt={data.title}
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
          {formatArtists(data)}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default AlbumItem;
