"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSessionContext } from "@/providers/SupabaseProvider";
import type { Artist } from "@/types/types";
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

interface CreateArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artist: Artist) => void;
}

const CreateArtistModal: React.FC<CreateArtistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { supabaseClient } = useSessionContext();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabaseClient
        .from("artists")
        .insert({ name: name.trim(), image_url: null })
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
