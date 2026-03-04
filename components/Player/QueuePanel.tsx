"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { ListMusic } from "lucide-react";
import usePlayer from "@/hooks/usePlayer";
import DraggableQueueItem from "./DraggableQueueItem";
import PanelBackButton from "./PanelBackButton";

/**
 * Interface for QueuePanel component props.
 * 
 * @author Maruf Bepary
 */
interface QueuePanelProps {
  /**
   * Callback function to close the queue panel.
   */
  onClose: () => void;
}

/**
 * The QueuePanel component displays the current playback queue.
 * Allows users to review, reorder, and remove songs from the queue.
 * Integrates with dnd-kit for drag-and-drop reordering.
 * 
 * @param props - QueuePanel props containing the onClose callback
 * @returns React functional component
 * @author Maruf Bepary
 */
const QueuePanel: React.FC<QueuePanelProps> = ({ onClose }) => {
  const player = usePlayer();
  const { songs, ids, activeId } = player;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = ids.indexOf(active.id as number);
      const newIndex = ids.indexOf(over.id as number);
      player.reorderQueue(arrayMove(ids, oldIndex, newIndex));
    },
    [ids, player]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-x-2 p-4 border-b border-border">
        <PanelBackButton onClick={onClose} iconType="back" />
        <span className="flex-1 text-center font-semibold text-sm pr-8">
          Queue
          {songs.length > 0 && (
            <span className="ml-1 text-xs text-muted-foreground font-normal">
              ({songs.length} {songs.length === 1 ? "song" : "songs"})
            </span>
          )}
        </span>
      </div>

      {/* Content */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-y-2 text-center px-4">
          <ListMusic size={32} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Your queue is empty</p>
          <p className="text-xs text-muted-foreground/60">
						{`Use "Play next" or "Add to queue" to build a queue`}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {songs.map((song) => (
                <DraggableQueueItem
                  key={song.id}
                  song={song}
                  isActive={song.id === activeId}
                  onPlay={(id) => player.setId(id)}
                  onRemove={(id) => player.removeFromQueue(id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
