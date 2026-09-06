"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import useLoadImage from "@/hooks/use-load-image";
import { formatArtists } from "@/lib/music/format-artists";
import type { AlbumWithArtists } from "../../types/music/album-with-artists";

/**
 * Album card for grid discovery layouts.
 * Displays cover art, title, and contributing artists.
 * Used throughout the app for consistent album browsing experience.
 *
 * @author Maruf Bepary
 */

interface AlbumItemProps {
  data: AlbumWithArtists;
  onClick: (id: string) => void;
  priority?: boolean;
}

/**
 * A standard album tile for consistent discovery grid layouts.
 * Visualizes an album's cover art, title, and contributing artists.
 * Optimized for grid-based browsing in the main content area.
 *
 * @author Maruf Bepary
 * @param data The detailed album object including associated artists.
 * @param onClick Navigation or playback handler triggered on selection.
 * @param priority Optimization flag for early image rendering in high-visibility areas.
 */
const AlbumItem: React.FC<AlbumItemProps> = ({ data, onClick, priority = false }) => {
  const imagePath = useLoadImage(data.coverImagePath);

  return (
    <Item
      onClick={() => onClick(data.id)}
      variant="muted"
      size="sm"
      className="group relative flex cursor-pointer flex-col items-start gap-x-3 rounded-lg border border-border bg-muted/60 p-2 transition hover:bg-muted max-sm:flex-row max-sm:items-center"
    >
      <div className="relative aspect-square h-auto w-full overflow-hidden rounded-lg max-sm:aspect-auto max-sm:h-16 max-sm:w-16 max-sm:shrink-0">
        {imagePath ? (
          <Image
            className="object-cover"
            src={imagePath}
            fill
            sizes="(max-width: 640px) 64px, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 12.5vw"
            alt={data.title}
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Music className="size-1/2 text-muted-foreground" />
          </div>
        )}
      </div>
      <ItemContent className="flex w-full flex-col items-start gap-y-1 pt-4 max-sm:pt-0">
        <ItemTitle className="w-full truncate font-semibold text-lg">{data.title}</ItemTitle>
        <ItemDescription className="w-full truncate pb-4 text-muted-foreground text-sm max-sm:pb-0">
          {formatArtists(data)}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default AlbumItem;
