"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { AlbumDetail } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import { formatArtists } from "@/lib/utils";
import { toSongsWithAlbum } from "@/lib/mappers";
import SongsGrid from "@/components/SongsGrid";
import { useUser } from "@/hooks/useUser";
import renameAlbum from "@/actions/renameAlbum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlbumDetailContentProps {
  album: AlbumDetail;
}

const AlbumDetailContent: React.FC<AlbumDetailContentProps> = ({ album }) => {
  const router = useRouter();
  const { user } = useUser();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(album.title);
  const [isRenaming, setIsRenaming] = useState(false);

  const isOwner = user?.id === album.uploaderId;

  const songsWithAlbum = toSongsWithAlbum(album);
  const imageUrl = useLoadImage(album.coverImagePath);
  const artistNames = formatArtists(album);
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : null;

  const onRename = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === album.title) {
      setIsRenameDialogOpen(false);
      return;
    }
    setIsRenaming(true);
    try {
      const success = await renameAlbum(album.id, trimmed);
      if (success) {
        toast.success("Album renamed");
        router.refresh();
        setIsRenameDialogOpen(false);
      } else {
        toast.error("Failed to rename album");
      }
    } catch {
      toast.error("Failed to rename album");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Album Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-md shadow-lg sm:h-56 sm:w-56">
          <Image
            src={imageUrl ?? "/images/music-placeholder.png"}
            fill
            sizes="(max-width: 640px) 192px, 224px"
            alt={album.title}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-y-2 sm:items-start">
          <div className="flex items-center gap-x-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{album.title}</h1>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNewTitle(album.title);
                  setIsRenameDialogOpen(true);
                }}
                aria-label="Rename album"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {artistNames}
            {releaseYear && ` • ${releaseYear}`}
            {` • ${album.songs.length} ${album.songs.length === 1 ? "track" : "tracks"}`}
          </p>
        </div>
      </div>

      {/* Track Listing */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-semibold">Tracks</h2>
        <SongsGrid songs={songsWithAlbum} />
      </div>

      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(open) => {
          if (!open) setNewTitle(album.title);
          setIsRenameDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Album</DialogTitle>
            <DialogDescription>
              Enter a new name for this album.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Album title"
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
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlbumDetailContent;
