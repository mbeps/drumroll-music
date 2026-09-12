"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type React from "react";

import SongItem from "@/components/song/song-item";
import type { SongWithAlbum } from "@/types/music/song-with-album";

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
const DraggableSongItem: React.FC<DraggableSongItemProps> = ({ song, onClick, isOwner }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative h-full">
      <SongItem
        data={song}
        onClick={onClick}
        rightAction={
          isOwner && (
            <div
              {...attributes}
              {...listeners}
              className="/* Mobile: Flex Child */ /* Desktop: Bottom Center Absolute */ flex h-10 w-8 cursor-grab items-center justify-center rounded-md bg-black/40 text-white/70 opacity-100 transition hover:bg-black/60 hover:text-white active:cursor-grabbing md:absolute md:top-auto md:right-auto md:bottom-2 md:left-1/2 md:z-20 md:h-6 md:w-20 md:-translate-x-1/2 md:translate-y-0 md:opacity-0 md:group-hover:opacity-100"
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
