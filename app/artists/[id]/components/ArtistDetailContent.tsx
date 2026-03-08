"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  User,
  Camera,
  Pencil,
  ImagePlus,
  ImageMinus,
  UserMinus,
} from "lucide-react";
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
import deleteArtistImage from "@/actions/deleteArtistImage";
import { RenameArtistSchema } from "@/schemas/artists/rename-artist.schema";
import { ArtistImageFileSchema } from "@/schemas/artists/artist-image-file.schema";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Props for the ArtistDetailContent component.
 *
 * @author Maruf Bepary
 */
interface ArtistDetailContentProps {
  artist: ArtistWithAlbums;
}

/**
 * Client Component that displays detailed information about an artist.
 * Renders the artist's avatar, name, and albums grid. Provides owner-only
 * actions (rename, delete, image update/delete) via a dropdown menu and
 * an inline image overlay.
 *
 * @param props - Expects an `ArtistWithAlbums` object as `artist`
 * @author Maruf Bepary
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
  const [isImageDeleteDialogOpen, setIsImageDeleteDialogOpen] = useState(false);
  const [isImageDeleting, setIsImageDeleting] = useState(false);

  const isOwner = user?.id === artist.uploaderId;

  const imageUrl = useLoadImage(artist.imageUrl);

  /**
   * Validates the selected file, uploads it to Supabase Storage, and calls
   * updateArtistImage to persist the new path. Refreshes the page on success.
   *
   * @param e - The file input change event
   * @author Maruf Bepary
   */
  const onUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isOwner) return;

    const fileParsed = ArtistImageFileSchema.safeParse(file);
    if (!fileParsed.success) {
      return toast.error(fileParsed.error.issues[0]?.message ?? "Invalid image file");
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

  /**
   * Calls deleteArtistImage to remove the artist's profile image from both
   * storage and the database. Refreshes the page on success.
   *
   * @author Maruf Bepary
   */
  const onDeleteImage = async () => {
    setIsImageDeleting(true);
    try {
      const success = await deleteArtistImage(artist.id);
      if (success) {
        toast.success("Artist image deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete artist image");
      }
    } catch {
      toast.error("An error occurred while deleting the artist image");
    } finally {
      setIsImageDeleting(false);
      setIsImageDeleteDialogOpen(false);
    }
  };

  /**
   * Calls deleteArtist to permanently remove the artist and their storage image.
   * Redirects to the artists listing page on success.
   *
   * @author Maruf Bepary
   */
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

  /**
   * Validates the new name with RenameArtistSchema, then calls renameArtist.
   * Closes the rename dialog and refreshes the page on success.
   *
   * @author Maruf Bepary
   */
  const onRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === artist.name) {
      setIsRenameDialogOpen(false);
      return;
    }
    const parsed = RenameArtistSchema.safeParse({ artistId: artist.id, newName: trimmed });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid artist name");
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="size-4 mr-2" />
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    setNewName(artist.name);
                    setIsRenameDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    document.getElementById("artist-image-update")?.click()
                  }
                >
                  <ImagePlus className="mr-2 size-4" />
                  Change Image
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {artist.imageUrl && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setIsImageDeleteDialogOpen(true)}
                  >
                    <ImageMinus className="mr-2 size-4" />
                    Delete Image
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <UserMinus className="mr-2 size-4" />
                  Delete Artist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Delete Image Confirmation Dialog */}
      <Dialog 
        open={isImageDeleteDialogOpen} 
        onOpenChange={setIsImageDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Artist Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the profile image for &quot;{artist.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImageDeleteDialogOpen(false)}
              disabled={isImageDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteImage}
              disabled={isImageDeleting}
            >
              {isImageDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistDetailContent;

