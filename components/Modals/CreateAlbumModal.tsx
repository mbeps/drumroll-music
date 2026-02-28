"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import uniqid from "uniqid";
import { useSessionContext } from "@/providers/SupabaseProvider";
import { useUser } from "@/hooks/useUser";
import type { Artist, AlbumWithArtists } from "@/types/types";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (album: AlbumWithArtists) => void;
  defaultArtistId?: string;
}

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
          setArtists(data.map((a) => ({ id: a.id, name: a.name, imageUrl: a.image_url })));
        }
      });
  }, [isOpen, supabaseClient]);

  useEffect(() => {
    if (defaultArtistId) setArtistId(defaultArtistId);
  }, [defaultArtistId]);

  const handleClose = () => {
    setTitle("");
    setArtistId(defaultArtistId ?? "");
    setArtistSearch("");
    setImageFile(null);
    onClose();
  };

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(artistSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artistId || !user) return;

    try {
      setIsLoading(true);

      let coverImagePath: string | null = null;

      // Upload cover image if provided
      if (imageFile) {
        const uniqueId = uniqid();
        const { data: imgData, error: imgError } = await supabaseClient.storage
          .from("images")
          .upload(`image-${title.trim()}-${uniqueId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imgError) {
          toast.error("Failed to upload cover image");
          return;
        }
        coverImagePath = imgData.path;
      }

      // Insert album
      const { data: album, error: albumError } = await supabaseClient
        .from("albums")
        .insert({
          title: title.trim(),
          uploader_id: user.id,
          cover_image_path: coverImagePath,
        })
        .select("id")
        .single();

      if (albumError || !album) {
        toast.error("Failed to create album");
        return;
      }

      // Link artist
      const { error: linkError } = await supabaseClient
        .from("album_artists")
        .insert({ album_id: album.id, artist_id: artistId });

      if (linkError) {
        toast.error("Failed to link artist to album");
        return;
      }

      // Fetch full album
      const { data: fullAlbum, error: fetchError } = await supabaseClient
        .from("albums")
        .select(ALBUM_WITH_ARTISTS_SELECT)
        .eq("id", album.id)
        .single();

      if (fetchError || !fullAlbum) {
        toast.error("Failed to fetch created album");
        return;
      }

      const mapped = mapAlbumWithArtistsRow(
        fullAlbum as Parameters<typeof mapAlbumWithArtistsRow>[0]
      );

      toast.success(`Album "${mapped.title}" created`);
      onSuccess(mapped);
      handleClose();
    } catch {
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
          <DialogDescription>Create a new album with an artist and optional cover art.</DialogDescription>
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
                <span className="text-sm font-medium">{selectedArtistName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setArtistId(""); setArtistSearch(""); }}
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
                  <div className="border rounded-md max-h-40 overflow-y-auto mt-1">
                    {filteredArtists.length === 0 && (
                      <p className="text-sm text-muted-foreground px-3 py-2">No artists found</p>
                    )}
                    {filteredArtists.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => { setArtistId(a.id); setArtistSearch(""); }}
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
