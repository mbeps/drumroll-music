"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import uniqid from "uniqid";
import createAlbum from "@/actions/album/create-album";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { getLogger } from "@/lib/logger";
import { useSessionContext } from "@/providers/supabase-provider";
import { CreateAlbumSchema } from "@/schemas/albums/create-album.schema";
import type { Artist } from "../../types/artist/artist";
import type { AlbumWithArtists } from "../../types/music/album-with-artists";

const logger = getLogger(["app", "frontend", "album-modal"]);

/**
 * Modal dialog for creating a new album with artist association.
 * Called from the upload flow to allow in-context album creation.
 * Invokes the success callback with the newly-created AlbumWithArtists domain object.
 *
 * @author Maruf Bepary
 */

interface CreateAlbumModalProps {
  /**
   * Controls whether the dialog is visible.
   */
  isOpen: boolean;
  /**
   * Callback invoked when the dialog should close without creating an album.
   */
  onClose: () => void;
  /**
   * Callback invoked after a new album has been successfully created.
   * Receives the fully-mapped AlbumWithArtists domain object.
   */
  onSuccess: (album: AlbumWithArtists) => void;
  /**
   * Pre-selects an artist in the artist picker.
   * Useful when opening this modal from an artist detail page.
   */
  defaultArtistId?: string;
}

/**
 * Modal dialog for creating a new album.
 * Fetches existing artists from Supabase to populate the artist picker,
 * optionally uploads a cover image to Supabase Storage, then inserts the
 * album row and the album_artists junction record in a single flow.
 * Calls `onSuccess` with the fully-resolved AlbumWithArtists on completion.
 *
 * @param props - See CreateAlbumModalProps
 * @author Maruf Bepary
 */
const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultArtistId,
}) => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState(defaultArtistId ?? "");
  const [artistSearch, setArtistSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    supabaseClient
      .from("artists")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setArtists(
            data.map((a) => ({
              id: a.id,
              name: a.name,
              imageUrl: a.image_url,
              uploaderId: a.uploader_id,
            })),
          );
        }
      });
  }, [isOpen, supabaseClient]);

  useEffect(() => {
    if (defaultArtistId) setArtistId(defaultArtistId);
  }, [defaultArtistId]);

  /**
   * Resets all local form state and calls the parent `onClose` callback.
   *
   * @author Maruf Bepary
   */
  const handleClose = () => {
    setTitle("");
    setArtistId(defaultArtistId ?? "");
    setArtistSearch("");
    setImageFile(null);
    onClose();
  };

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(artistSearch.toLowerCase()),
  );

  /**
   * Handles form submission: validates input with CreateAlbumSchema, optionally
   * uploads a cover image to Supabase Storage, inserts the album row, links the
   * selected artist via album_artists, then fetches the full AlbumWithArtists and
   * calls `onSuccess`.
   *
   * @param e - The form submit event
   * @author Maruf Bepary
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const parsed = CreateAlbumSchema.safeParse({ title, artistId });
    if (!parsed.success) {
      logger.warn("Album creation validation failed");
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    try {
      setIsLoading(true);
      logger.info("Submitting album creation");

      let coverImagePath: string | null = null;

      // Upload cover image if provided
      if (imageFile) {
        const uniqueId = uniqid();
        const { data: imgData, error: imgError } = await supabaseClient.storage
          .from("images")
          .upload(`image-${parsed.data.title}-${uniqueId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imgError) {
          logger.error("Failed to upload album cover image: {message}", {
            message: imgError.message,
          });
          toast.error("Failed to upload cover image");
          return;
        }
        coverImagePath = imgData.path;
      }

      // Call createAlbum server action
      const result = await createAlbum({
        title: parsed.data.title,
        artistId,
        coverImagePath,
      });

      if (!result.ok || !result.album) {
        toast.error(result.error ?? "Failed to create album");
        return;
      }

      toast.success(`Album "${result.album.title}" created`);
      onSuccess(result.album);
      handleClose();
    } catch (error) {
      logger.error("Unexpected error creating album: {message}", {
        message: error instanceof Error ? error.message : String(error),
      });
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedArtistName = artists.find((a) => a.id === artistId)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Album</DialogTitle>
          <DialogDescription>
            Create a new album with an artist and optional cover art.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="album-title">Album Title</Label>
            <Input
              id="album-title"
              disabled={isLoading}
              placeholder="Enter album title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Artist</Label>
            {selectedArtistName && !artistSearch ? (
              <div className="flex items-center gap-x-2">
                <span className="font-medium text-sm">{selectedArtistName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setArtistId("");
                    setArtistSearch("");
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search artists…"
                  value={artistSearch}
                  onChange={(e) => setArtistSearch(e.target.value)}
                  disabled={isLoading}
                />
                {(artistSearch || !artistId) && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-md border">
                    {filteredArtists.length === 0 && (
                      <p className="px-3 py-2 text-muted-foreground text-sm">No artists found</p>
                    )}
                    {filteredArtists.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                        onClick={() => {
                          setArtistId(a.id);
                          setArtistSearch("");
                        }}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <Label htmlFor="cover-image">Cover Image (optional)</Label>
            <Input
              id="cover-image"
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex justify-end gap-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !artistId}>
              {isLoading ? "Creating…" : "Create Album"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumModal;
