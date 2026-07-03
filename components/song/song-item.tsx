"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Music } from "lucide-react";

import type { SongWithAlbum } from "../../types/music/song-with-album";
import useLoadImage from "@/hooks/use-load-image";
import { formatArtists } from "@/lib/music/format-artists";
import PlayButton from "../play-button";
import SongOptionsMenu from "./song-options-menu";
import { Button } from "../ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

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
        <div className="
          max-sm:hidden
          absolute 
          inset-0 
          bg-black/20
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          flex 
          items-center 
          justify-center 
          flex-col 
          gap-y-2
          z-20
        ">
          <PlayButton 
            className="
              opacity-100
              translate-y-0
              bg-green-500 
              rounded-full 
              p-4 
              hover:scale-110
              transition
            " 
          />
          <SongOptionsMenu
            songId={data.id}
            song={data}
            drawerOpen={drawerOpen}
            onDrawerOpenChange={setDrawerOpen}
            triggerClassName="static top-auto right-auto rounded-full bg-white/10 hover:bg-white/20 text-white size-8 flex items-center justify-center"
          />
        </div>
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
