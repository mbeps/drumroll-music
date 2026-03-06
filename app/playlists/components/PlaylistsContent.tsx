"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Playlist } from "../../../types/playlist";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@/providers/SupabaseProvider";
import PlaylistItem from "@/components/PlaylistItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

interface PlaylistsContentProps {
  playlists: Playlist[];
  favouritesPlaylist: Playlist | null;
}

/**
 * Main content component for the playlists page.
 * Displays a list of playlists and provides functionality to create new ones.
 * Redirects unauthenticated users to the home page.
 * 
 * @param props - Component properties.
 * @param props.playlists - Array of playlist objects.
 * @param props.favouritesPlaylist - The special favourites playlist object, if any.
 */
const PlaylistsContent: React.FC<PlaylistsContentProps> = ({
  playlists,
  favouritesPlaylist,
}) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { isLoading, user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newPlaylistTitle.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    if (!user) return;

    setIsCreating(true);

    const { error } = await supabaseClient
      .from("playlists")
      .insert({ user_id: user.id, title: newPlaylistTitle.trim(), is_favourites: false });

    setIsCreating(false);

    if (error) {
      toast.error("Failed to create playlist");
      return;
    }

    toast.success("Playlist created");
    setNewPlaylistTitle("");
    setShowCreateDialog(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-y-4 px-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Playlists</h2>
        <Button
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          className="gap-x-1"
        >
          <Plus className="size-4" />
          New Playlist
        </Button>
      </div>

      {/* Search input */}
      <Input
        placeholder="Search playlists..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Favourites card */}
      {favouritesPlaylist && (
        <Item
          onClick={() => router.push("/favourites")}
          size="sm"
          className="
            flex
            items-center
            gap-x-2
            cursor-pointer
            bg-muted/40
            hover:bg-muted/80
            transition
            w-full
            p-2
            rounded-lg
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              min-h-[48px]
              min-w-[48px]
              rounded-lg
              bg-rose-500/10
            "
          >
            <Heart className="size-5 fill-rose-500 text-rose-500" />
          </div>
          <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
            <ItemTitle className="text-foreground truncate">Liked Songs</ItemTitle>
            <ItemDescription className="truncate">Your favourites</ItemDescription>
          </ItemContent>
        </Item>
      )}

      {/* Regular playlists */}
      {filteredPlaylists.length === 0 && !favouritesPlaylist ? (
        <p className="text-muted-foreground">
          No playlists yet. Create one to get started.
        </p>
      ) : filteredPlaylists.length === 0 && searchQuery ? (
        <p className="text-muted-foreground">No playlists match your search.</p>
      ) : (
        filteredPlaylists.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            data={playlist}
            onClick={(id) => router.push(`/playlists/${id}`)}
          />
        ))
      )}

      {/* Create playlist dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New playlist</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Playlist name"
            value={newPlaylistTitle}
            onChange={(e) => setNewPlaylistTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistsContent;

