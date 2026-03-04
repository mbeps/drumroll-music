"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import uniqid from "uniqid";

import { useSessionContext } from "@/providers/SupabaseProvider";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadFormValues {
  artistName: string;
  albumTitle: string;
  songTitle: string;
  trackNumber: number;
  song: FileList;
  image: FileList;
}

const UploadModal = () => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<UploadFormValues>({
    defaultValues: {
      artistName: "",
      albumTitle: "",
      songTitle: "",
      trackNumber: 1,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<UploadFormValues> = async (values) => {
    if (!user) {
      toast.error("Please sign in to upload");
      return;
    }

    try {
      setIsLoading(true);

      const songFile = values.song?.[0];
      const imageFile = values.image?.[0];

      if (!songFile || !imageFile) {
        toast.error("Please select both a song and cover image");
        return;
      }

      const uniqueId = uniqid();

      // 1. Upload cover image
      const { data: imageData, error: imageError } = await supabaseClient.storage
        .from("images")
        .upload(`image-${values.albumTitle}-${uniqueId}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        toast.error("Failed to upload cover image");
        return;
      }

      // 2. Upload song file
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.songTitle}-${uniqueId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        toast.error("Failed to upload song file");
        return;
      }

      // 3. Find or create artist
      const { data: existingArtists } = await supabaseClient
        .from("artists")
        .select("id")
        .ilike("name", values.artistName)
        .limit(1);

      let artistId: string;

      if (existingArtists && existingArtists.length > 0) {
        artistId = existingArtists[0].id;
      } else {
        const { data: newArtist, error: artistError } = await supabaseClient
          .from("artists")
          .insert({ name: values.artistName })
          .select("id")
          .single();

        if (artistError || !newArtist) {
          toast.error("Failed to create artist");
          return;
        }
        artistId = newArtist.id;
      }

      // 4. Create album
      const { data: album, error: albumError } = await supabaseClient
        .from("albums")
        .insert({
          title: values.albumTitle,
          cover_image_path: imageData.path,
          uploader_id: user.id,
        })
        .select("id")
        .single();

      if (albumError || !album) {
        toast.error("Failed to create album");
        return;
      }

      // 5. Link artist to album
      const { error: linkError } = await supabaseClient
        .from("album_artists")
        .insert({
          album_id: album.id,
          artist_id: artistId,
        });

      if (linkError) {
        toast.error("Failed to link artist to album");
        return;
      }

      // 6. Create song record
      const { error: insertError } = await supabaseClient
        .from("songs")
        .insert({
          title: values.songTitle,
          album_id: album.id,
          track_number: values.trackNumber,
          song_path: songData.path,
          uploader_id: user.id,
        });

      if (insertError) {
        toast.error(insertError.message);
        return;
      }

      router.refresh();
      toast.success("Song uploaded successfully!");
      reset();
      uploadModal.onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={uploadModal.isOpen} onOpenChange={onChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload a Song</DialogTitle>
          <DialogDescription>Upload an audio file with album details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Artist Name</label>
            <Input
              disabled={isLoading}
              placeholder="Artist name"
              {...register("artistName", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              disabled={isLoading}
              placeholder="Album title"
              {...register("albumTitle", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Song Title</label>
            <Input
              disabled={isLoading}
              placeholder="Song title"
              {...register("songTitle", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Track Number</label>
            <Input
              type="number"
              disabled={isLoading}
              min={1}
              {...register("trackNumber", { required: true, valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Song File (MP3)</label>
            <Input
              type="file"
              accept=".mp3"
              disabled={isLoading}
              {...register("song", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Cover Image</label>
            <Input
              type="file"
              accept="image/*"
              disabled={isLoading}
              {...register("image", { required: true })}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
