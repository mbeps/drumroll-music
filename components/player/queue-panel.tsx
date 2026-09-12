"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListMusic } from "lucide-react";
import { useCallback } from "react";
import DraggableQueueItem from "@/components/player/draggable-queue-item";
import PanelBackButton from "@/components/player/panel-back-button";
import usePlayer from "@/hooks/use-player";

/**
 * Player panel for managing the current playback queue.
 * Supports drag-and-drop manual reordering of upcoming tracks via @dnd-kit.
 * Displays the full queue with current track highlighted.
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
 * An interactive panel for managing the current playback queue.
 * Integrates `@dnd-kit` to support manual drag-and-drop reordering of upcoming
 * tracks. Synchronizes directly with the `usePlayer` store to maintain state
 * across the application session.
 *
 * @author Maruf Bepary
 * @param onClose Handler to close the panel view (typically for mobile drawers).
 */
const QueuePanel: React.FC<QueuePanelProps> = ({ onClose }) => {
  const player = usePlayer();
  const { songs, ids, activeId } = player;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = ids.indexOf(active.id as number);
      const newIndex = ids.indexOf(over.id as number);
      player.reorderQueue(arrayMove(ids, oldIndex, newIndex));
    },
    [ids, player],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-x-2 border-border border-b p-4">
        <PanelBackButton onClick={onClose} iconType="back" />
        <span className="flex-1 pr-8 text-center font-semibold text-sm">
          Queue
          {songs.length > 0 && (
            <span className="ml-1 font-normal text-muted-foreground text-xs">
              ({songs.length} {songs.length === 1 ? "song" : "songs"})
            </span>
          )}
        </span>
      </div>

      {/* Content */}
      {songs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-y-2 px-4 text-center">
          <ListMusic size={32} className="text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">Your queue is empty</p>
          <p className="text-muted-foreground/60 text-xs">
            {`Use "Play next" or "Add to queue" to build a queue`}
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
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
