"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { ArtistWithAlbums } from "@/types/types";
import useLoadImage from "@/hooks/useLoadImage";
import AlbumsGrid from "@/components/AlbumsGrid";
import { useUser } from "@/hooks/useUser";
import renameArtist from "@/actions/renameArtist";
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

interface ArtistDetailContentProps {
  artist: ArtistWithAlbums;
}

const ArtistDetailContent: React.FC<ArtistDetailContentProps> = ({
  artist,
}) => {
  const router = useRouter();
  const { user } = useUser();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(artist.name);
  const [isRenaming, setIsRenaming] = useState(false);

  const isOwner = user?.id === artist.uploaderId;

  const imageUrl = useLoadImage(artist.imageUrl);

  const onRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === artist.name) {
      setIsRenameDialogOpen(false);
      return;
    }
    setIsRenaming(true);
    try {
      const success = await renameArtist(artist.id, trimmed);
      if (success) {
        toast.success("Artist renamed");
        router.refresh();
        setIsRenameDialogOpen(false);
      } else {
        toast.error("Failed to rename artist");
      }
    } catch {
      toast.error("Failed to rename artist");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 pb-6">
      {/* Artist Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-lg sm:h-56 sm:w-56">
          <Image
            src={imageUrl ?? "/images/music-placeholder.png"}
            fill
            sizes="(max-width: 640px) 192px, 224px"
            alt={artist.name}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-y-2 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground">Artist</p>
          <div className="flex items-center gap-x-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{artist.name}</h1>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNewName(artist.name);
                  setIsRenameDialogOpen(true);
                }}
                aria-label="Rename artist"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {artist.albums.length}{" "}
            {artist.albums.length === 1 ? "album" : "albums"}
          </p>
        </div>
      </div>

      {/* Albums */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-semibold">Discography</h2>
        <AlbumsGrid albums={artist.albums} />
      </div>

      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(open) => {
          if (!open) setNewName(artist.name);
          setIsRenameDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Artist</DialogTitle>
            <DialogDescription>
              Enter a new name for this artist.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Artist name"
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
              disabled={isRenaming || !newName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistDetailContent;

