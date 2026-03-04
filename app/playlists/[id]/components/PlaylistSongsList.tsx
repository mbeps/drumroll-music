"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { SongWithAlbum } from "@/types/types";
import DraggableSongItem from "@/components/DraggableSongItem";
import { GRID_CLASSES } from "@/lib/utils";
import useOnPlay from "@/hooks/useOnPlay";
import reorderPlaylistSongs from "@/actions/reorderPlaylistSongs";

interface PlaylistSongsListProps {
  songs: SongWithAlbum[];
  playlistId: string;
  isOwner: boolean;
}

/**
 * A client-side component that renders a list of songs within a playlist.
 * Supports drag-and-drop reordering using @dnd-kit when the user is the owner.
 *
 * @param props The component props.
 * @param props.songs The list of songs to display.
 * @param props.playlistId The ID of the playlist.
 * @param props.isOwner Whether the current user is the owner of the playlist.
 * @author Maruf Bepary
 */
const PlaylistSongsList: React.FC<PlaylistSongsListProps> = ({
  songs: initialSongs,
  playlistId,
  isOwner,
}) => {
  const router = useRouter();
  const [songs, setSongs] = useState<SongWithAlbum[]>(initialSongs);
  const onPlay = useOnPlay(songs);

  // Sync state if initialSongs changes (e.g. searching, which isn't here yet but good practice)
  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = songs.findIndex((s) => s.id === active.id);
      const newIndex = songs.findIndex((s) => s.id === over.id);

      const newSongs = arrayMove(songs, oldIndex, newIndex);
      setSongs(newSongs);

      const songIds = newSongs.map((s) => s.id);
      
      try {
        const success = await reorderPlaylistSongs(playlistId, songIds);
        if (success) {
          toast.success("Playlist order updated");
          router.refresh();
        } else {
          toast.error("Failed to save new order");
          setSongs(initialSongs); // Revert
        }
      } catch {
        toast.error("Something went wrong while reordering");
        setSongs(initialSongs); // Revert
      }
    }
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-muted-foreground">
        No songs available.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={songs} strategy={rectSortingStrategy}>
        <div className={GRID_CLASSES}>
          {songs.map((song) => (
            <DraggableSongItem
              key={song.id}
              song={song}
              onClick={(id: number) => onPlay(id)}
              isOwner={isOwner}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistSongsList;
