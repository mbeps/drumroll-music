"use client";

import { MoreHorizontal, Music } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PlayButton from "@/components/song/play-button";
import SongOptionsMenu from "@/components/song/song-options-menu";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import useLoadImage from "@/hooks/use-load-image";
import { formatArtists } from "@/lib/music/format-artists";
import type { SongWithAlbum } from "@/types/music/song-with-album";

/**
 * Rich song card for grid discovery displays.
 * Shows album artwork, title, and formatted artist names with integrated action menu.
 * Includes hover-activated play button and options menu for queue/playlist management.
 *
 * @author Maruf Bepary
 */

interface SongItemProps {
  /** The song entity including full album metadata. */
  data: SongWithAlbum;
  /** Callback invoked with song ID when clicked (typically starts playback). */
  onClick: (id: number) => void;
  /** If true, prioritizes image loading (recommended for above-the-fold items). */
  priority?: boolean;
  /** Optional UI element to render in the right action area. */
  rightAction?: React.ReactNode;
}

/**
 * Renders a grid card with song metadata and interactive controls.
 *
 * @param props - See SongItemProps
 * @author Maruf Bepary
 */
const SongItem: React.FC<SongItemProps> = ({ data, onClick, priority = false, rightAction }) => {
  const imagePath = useLoadImage(data.album.coverImagePath);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Item
      onClick={() => onClick(data.id)}
      variant="muted"
      size="sm"
      className="group relative flex cursor-pointer flex-col items-start gap-x-3 rounded-lg border border-border bg-muted/60 p-2 transition hover:bg-muted max-sm:flex-row max-sm:items-center max-sm:pr-4"
    >
      <div className="relative aspect-square h-auto w-full overflow-hidden rounded-lg max-sm:aspect-auto max-sm:h-16 max-sm:w-16 max-sm:shrink-0">
        {imagePath ? (
          <Image
            className="object-cover transition sm:group-hover:blur-sm"
            src={imagePath}
            fill
            sizes="(max-width: 640px) 64px, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 12.5vw"
            alt="Image"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted transition sm:group-hover:blur-sm">
            <Music className="size-1/2 text-muted-foreground" />
          </div>
        )}

        {/* Desktop Central Controls Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-y-2 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 max-sm:hidden">
          <PlayButton className="translate-y-0 p-4 opacity-100 transition hover:scale-110" />
          <SongOptionsMenu
            songId={data.id}
            song={data}
            drawerOpen={drawerOpen}
            onDrawerOpenChange={setDrawerOpen}
            triggerClassName="static top-auto right-auto rounded-full bg-white/10 hover:bg-white/20 text-white size-8 flex items-center justify-center"
          />
        </div>
      </div>
      <ItemContent className="flex w-full flex-col items-start gap-y-1 pt-4 max-sm:pt-0">
        <ItemTitle className="w-full truncate font-semibold text-lg">{data.title}</ItemTitle>
        <ItemDescription className="w-full truncate pb-4 text-muted-foreground text-sm max-sm:pb-0">
          By {formatArtists(data.album)}
        </ItemDescription>
      </ItemContent>

      <div className="flex shrink-0 items-center gap-x-2">
        {rightAction}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setDrawerOpen(true);
          }}
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </div>

      <div className="sm:hidden">
        <SongOptionsMenu
          songId={data.id}
          song={data}
          drawerOpen={drawerOpen}
          onDrawerOpenChange={setDrawerOpen}
        />
      </div>
    </Item>
  );
};

export default SongItem;
