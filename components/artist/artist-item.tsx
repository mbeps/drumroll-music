"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import useLoadImage from "@/hooks/use-load-image";
import type { Artist } from "../../types/artist/artist";

/**
 * Artist card for grid discovery layouts.
 * Displays artist profile image and name.
 * Used throughout the app for consistent artist browsing experience.
 *
 * @author Maruf Bepary
 */

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
      className="group relative flex cursor-pointer flex-col items-center gap-x-3 rounded-lg border border-border bg-muted/60 p-2 transition hover:bg-muted max-sm:flex-row"
    >
      <div className="relative aspect-square h-auto w-full overflow-hidden rounded-full max-sm:aspect-auto max-sm:h-16 max-sm:w-16 max-sm:shrink-0">
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
      <ItemContent className="flex w-full flex-col items-center gap-y-1 pt-4 max-sm:pt-0">
        <ItemTitle className="w-full truncate text-center font-semibold text-lg max-sm:text-left">
          {data.name}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
};

export default ArtistItem;
