"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/hooks/useUser";
import type { PlaylistWithSongs } from "@/types/types";
import deletePlaylist from "@/actions/deletePlaylist";
import renamePlaylist from "@/actions/renamePlaylist";
import { Input } from "@/components/ui/input";
import SongsGrid from "@/components/SongsGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlaylistDetailContentProps {
  playlist: PlaylistWithSongs;
}

const PlaylistDetailContent: React.FC<PlaylistDetailContentProps> = ({
  playlist,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(playlist.title);
  const [isRenaming, setIsRenaming] = useState(false);

  const isOwner = user?.id === playlist.userId;
  const canDelete = isOwner && !playlist.isFavourites;

  const onDelete = async () => {
    if (!canDelete) return;

    try {
      setIsDeleting(true);
      const success = await deletePlaylist(playlist.id);

      if (success) {
        toast.success("Playlist deleted");
        router.push("/playlists");
        router.refresh();
      } else {
        toast.error("Failed to delete playlist");
      }
    } catch {
      toast.error("An error occurred while deleting the playlist");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const onRename = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === playlist.title) {
      setIsRenameDialogOpen(false);
      return;
    }
    setIsRenaming(true);
    try {
      const success = await renamePlaylist(playlist.id, trimmed);
      if (success) {
        toast.success("Playlist renamed");
        router.refresh();
        setIsRenameDialogOpen(false);
      } else {
        toast.error("Failed to rename playlist");
      }
    } catch {
      toast.error("Failed to rename playlist");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Playlist Header */}
      <div className="flex flex-row items-end justify-between gap-x-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm font-medium text-muted-foreground">Playlist</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{playlist.title}</h1>
          <p className="text-sm text-muted-foreground">
            {playlist.songs.length}{" "}
            {playlist.songs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {canDelete && (
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRenameDialogOpen(true)}
              disabled={isRenaming}
              className="mb-1"
            >
              <Pencil className="size-4 mr-2" />
              Rename
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="mb-1"
            >
              <Trash2 className="size-4 mr-2" />
              Delete Playlist
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{playlist.title}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(open) => {
          setIsRenameDialogOpen(open);
          if (!open) setNewTitle(playlist.title);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Playlist</DialogTitle>
            <DialogDescription>
              Enter a new name for this playlist.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Playlist name"
            disabled={isRenaming}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              onClick={onRename}
              disabled={isRenaming || !newTitle.trim()}
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Song List */}
      <SongsGrid songs={playlist.songs} />
    </div>
  );
};

export default PlaylistDetailContent;
