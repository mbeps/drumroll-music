"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import SongItem from "@/components/song/song-item";
import type { SongWithAlbum } from "../types/music/song-with-album";

/**
 * Drag-and-drop wrapper for songs in sortable contexts.
 * Enables manual reordering of songs within playlists using @dnd-kit.
 * Displays a drag handle icon on hover for owner-controlled reordering.
 *
 * @author Maruf Bepary
 */

interface DraggableSongItemProps {
  /** The song object including album metadata. */
  song: SongWithAlbum;
  /** Callback invoked with song ID when the item is clicked (typically triggers playback). */
  onClick: (id: number) => void;
  /** If true, displays drag handle for reordering (typically owner-only). */
  isOwner?: boolean;
}

/**
 * Renders a draggable song item with visual feedback for drag state.
 *
 * @param props - See DraggableSongItemProps
 * @author Maruf Bepary
 */
const DraggableSongItem: React.FC<DraggableSongItemProps> = ({
  song,
  onClick,
  isOwner,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group h-full"
    >
      <SongItem
        data={song}
        onClick={onClick}
        rightAction={
          isOwner && (
            <div
              {...attributes}
              {...listeners}
              className="
                cursor-grab 
                active:cursor-grabbing 
                bg-black/40 
                hover:bg-black/60 
                rounded-md 
                text-white/70 
                hover:text-white 
                transition 
                
                /* Mobile: Flex Child */
                w-8 
                h-10 
                flex 
                items-center 
                justify-center
                opacity-100

                /* Desktop: Bottom Center Absolute */
                md:absolute
                md:top-auto 
                md:bottom-2 
                md:left-1/2 
                md:right-auto 
                md:-translate-x-1/2 
                md:translate-y-0
                md:w-20 
                md:h-6
                md:opacity-0 
                md:group-hover:opacity-100
                md:z-20
              "
            >
              <GripVertical size={18} />
            </div>
          )
        }
      />
    </div>
  );
};

export default DraggableSongItem;
