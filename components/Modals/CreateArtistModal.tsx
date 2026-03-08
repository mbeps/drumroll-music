"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSessionContext } from "@/providers/SupabaseProvider";
import uniqid from "uniqid";
import type { Artist } from "../../types/artist";
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

/**
 * Props for the CreateArtistModal component.
 *
 * @author Maruf Bepary
 */
interface CreateArtistModalProps {
  /**
   * Controls whether the dialog is visible.
   */
  isOpen: boolean;
  /**
   * Callback invoked when the dialog should close without creating an artist.
   */
  onClose: () => void;
  /**
   * Callback invoked after a new artist has been successfully created.
   * Receives the mapped Artist domain object.
   */
  onSuccess: (artist: Artist) => void;
}

/**
 * Modal dialog for creating a new artist.
 * Inserts an artist row into Supabase and calls `onSuccess` with the created
 * Artist object. Used during the song upload flow when no suitable artist
 * exists yet, and from artist management pages.
 *
 * @param props - See CreateArtistModalProps
 * @author Maruf Bepary
 */
const CreateArtistModal: React.FC<CreateArtistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { supabaseClient, user } = useSessionContext();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setName("");
    setImageFile(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      setIsLoading(true);

      let imagePath = null;

      if (imageFile) {
        // Validation
        if (imageFile.size > 2 * 1024 * 1024) {
          setIsLoading(false);
          return toast.error("Artist image must be less than 2MB");
        }
        if (!imageFile.type.startsWith("image/")) {
          setIsLoading(false);
          return toast.error("Only image files are allowed for artist profile");
        }

        // Upload image to Supabase storage
        const uniqueId = uniqid();
        const { data: storageData, error: storageError } = await supabaseClient
          .storage
          .from("images")
          .upload(`artist-${trimmedName}-${uniqueId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (storageError) {
          setIsLoading(false);
          return toast.error("Failed to upload image");
        }

        imagePath = storageData.path;
      }

      const { data, error } = await supabaseClient
        .from("artists")
        .insert({ name: trimmedName, image_url: imagePath, uploader_id: user?.id ?? null })
        .select("*")
        .single();

      if (error || !data) {
        toast.error("Failed to create artist");
        return;
      }

      const newArtist: Artist = {
        id: data.id,
        name: data.name,
        imageUrl: data.image_url,
        uploaderId: data.uploader_id,
      };

      toast.success(`Artist "${newArtist.name}" created`);
      onSuccess(newArtist);
      handleClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Artist</DialogTitle>
          <DialogDescription>Create a new artist to add to the library.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="artist-name">Artist Name</Label>
            <Input
              id="artist-name"
              disabled={isLoading}
              placeholder="Enter artist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="artist-image">Artist Image</Label>
            <Input
              id="artist-image"
              type="file"
              disabled={isLoading}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Upload a profile picture for the artist (max 2MB).
            </p>
          </div>
          <div className="flex justify-end gap-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creating…" : "Create Artist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArtistModal;
