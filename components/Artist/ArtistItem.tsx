"use client";

import Image from "next/image";
import { User } from "lucide-react";

import type { Artist } from "../../types/artist";
import useLoadImage from "@/hooks/useLoadImage";
import {
  Item,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";

interface ArtistItemProps {
  data: Artist;
  onClick: (id: string) => void;
  priority?: boolean;
}

/**
 * A visual representation of a music artist within the application.
 * Features the artist's profile image and name, styled for grid layouts.
 * Used for artist discovery and navigation throughout the platform.
 *
 * @author Maruf Bepary
 * @param data The artist entity object.
 * @param onClick Navigation handler to the artist's detail page.
 * @param priority Flag to prioritize image loading for above-the-fold content.
 */
const ArtistItem: React.FC<ArtistItemProps> = ({ data, onClick, priority = false }) => {
  const imageUrl = useLoadImage(data.imageUrl);

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
        items-center
        max-sm:flex-row
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
          rounded-full 
          overflow-hidden
        "
      >
        {imageUrl ? (
          <Image
            className="object-cover"
            src={imageUrl}
            fill
            sizes="(max-width: 640px) 64px, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 12.5vw"
            alt={data.name}
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User className="size-1/2 text-muted-foreground" />
          </div>
        )}
      </div>
      <ItemContent className="flex flex-col items-center w-full pt-4 max-sm:pt-0 gap-y-1">
        <ItemTitle className="font-semibold text-lg truncate w-full text-center max-sm:text-left">
          {data.name}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
};

export default ArtistItem;
