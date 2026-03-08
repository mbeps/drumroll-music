"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, User, Camera } from "lucide-react";
import { toast } from "sonner";
import uniqid from "uniqid";
import type { ArtistWithAlbums } from "../../../../types/artist-with-albums";
import useLoadImage from "@/hooks/useLoadImage";
import AlbumsGrid from "@/components/Album/AlbumsGrid";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@/providers/SupabaseProvider";
import renameArtist from "@/actions/renameArtist";
import deleteArtist from "@/actions/deleteArtist";
import updateArtistImage from "@/actions/updateArtistImage";
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

/**
 * Client Component that displays detailed information about an artist.
 * Includes the artist's name, cover image, and a list of their albums.
 * Provides administrative features (rename, delete) if the current user is the uploader.
 * 
 * @param props.artist The artist object including associated albums.
 */
const ArtistDetailContent: React.FC<ArtistDetailContentProps> = ({
  artist,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { supabaseClient } = useSessionContext();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(artist.name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageUpdating, setIsImageUpdating] = useState(false);

  const isOwner = user?.id === artist.uploaderId;

  const imageUrl = useLoadImage(artist.imageUrl);

  const onUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isOwner) return;

    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File size must be less than 2MB");
    }

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed");
    }

    setIsImageUpdating(true);

    try {
      const uniqueId = uniqid();
      const { data: storageData, error: storageError } = await supabaseClient
        .storage
        .from("images")
        .upload(`artist-${artist.name}-${uniqueId}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        throw new Error("Failed to upload image");
      }

      const success = await updateArtistImage(artist.id, storageData.path);
      
      if (success) {
        toast.success("Artist image updated");
        router.refresh();
      } else {
        toast.error("Failed to update artist image");
      }
    } catch (error) {
      toast.error("An error occurred while updating the image");
    } finally {
      setIsImageUpdating(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteArtist(artist.id);
      if (success) {
        toast.success("Artist deleted");
        router.push("/artists");
        router.refresh();
      } else {
        toast.error("Failed to delete artist");
      }
    } catch {
      toast.error("An error occurred while deleting the artist");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

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
        <div className="group relative h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-lg sm:h-56 sm:w-56">
          {imageUrl ? (
            <Image
              src={imageUrl}
              fill
              sizes="(max-width: 640px) 192px, 224px"
              alt={artist.name}
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <User className="size-24 text-muted-foreground" />
            </div>
          )}

          {isOwner && (
            <label
              htmlFor="artist-image-update"
              className={`absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 ${
                isImageUpdating ? "cursor-not-allowed opacity-100" : ""
              }`}
            >
              <Camera className="size-8 text-white" />
              <span className="mt-1 text-xs font-medium text-white">
                {isImageUpdating ? "Updating..." : "Change Image"}
              </span>
              <input
                id="artist-image-update"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onUpdateImage}
                disabled={isImageUpdating}
              />
            </label>
          )}
        </div>
        <div className="flex flex-col items-center gap-y-2 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground">Artist</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{artist.name}</h1>
          {isOwner && (
            <div className="flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewName(artist.name);
                  setIsRenameDialogOpen(true);
                }}
                disabled={isRenaming}
              >
                <Pencil className="size-4 mr-2" />
                Rename
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="size-4 mr-2" />
                Delete Artist
              </Button>
            </div>
          )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Artist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{artist.name}&quot;? Their albums will not be deleted, but the artist credit will be removed from all albums. This action cannot be undone.
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

