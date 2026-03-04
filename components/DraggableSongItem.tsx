"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import SongItem from "@/components/SongItem";
import type { SongWithAlbum } from "@/types/types";

interface DraggableSongItemProps {
  song: SongWithAlbum;
  onClick: (id: number) => void;
  isOwner?: boolean;
}

/**
 * A wrapper component that makes a SongItem sortable within a @dnd-kit context.
 * Displays a drag handle for owners when hovered.
 *
 * @param props The component props.
 * @param props.song The song data.
 * @param props.onClick Callback function when the song item is clicked.
 * @param props.isOwner Whether to display the drag handle for reordering.
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
      {isOwner && (
        <div
          {...attributes}
          {...listeners}
          className="
            absolute 
            z-20 
            cursor-grab 
            active:cursor-grabbing 
            bg-black/40 
            hover:bg-black/60 
            rounded-md 
            text-white/70 
            hover:text-white 
            transition 
            
            /* Mobile: Right Middle */
            right-2 
            top-1/2 
            -translate-y-1/2 
            w-8 
            h-10 
            flex 
            items-center 
            justify-center
            opacity-100

            /* Desktop: Bottom Center */
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
          "
        >
          <GripVertical size={18} />
        </div>
      )}
      <SongItem data={song} onClick={onClick} />
    </div>
  );
};

export default DraggableSongItem;
