"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QueueSongItem from "./QueueSongItem";
import type { SongWithAlbum } from "@/types/types";

/**
 * Interface for DraggableQueueItem component props.
 * 
 * @author Maruf Bepary
 */
interface DraggableQueueItemProps {
  /**
   * Complete metadata for the song to display.
   */
  song: SongWithAlbum;
  /**
   * Indicates if the song is currently playing.
   */
  isActive: boolean;
  /**
   * Callback function to jump to this song's playback.
   */
  onPlay: (id: number) => void;
  /**
   * Callback function to remove this song from the queue.
   */
  onRemove: (id: number) => void;
}

/**
 * A draggable wrapper component for items within the player queue.
 * Provides necessary drag-and-drop context for dnd-kit vertical sorting.
 * 
 * @param props - DraggableQueueItem props
 * @returns React functional component
 * @author Maruf Bepary
 */
const DraggableQueueItem: React.FC<DraggableQueueItemProps> = ({
  song,
  isActive,
  onPlay,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : undefined,
      }}
    >
      <QueueSongItem
        song={song}
        isActive={isActive}
        onPlay={onPlay}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

export default DraggableQueueItem;
