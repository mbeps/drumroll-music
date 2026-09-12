"use client";

import { Heart, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PlaylistItem from "@/components/playlist/playlist-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ROUTES } from "@/config/routes";
import useUser from "@/hooks/use-user";
import { useSessionContext } from "@/providers/supabase-provider";
import { CreatePlaylistSchema } from "@/schemas/playlist/create-playlist.schema";
import type { Playlist } from "@/types/playlist/playlist";

interface PlaylistsContentProps {
  playlists: Playlist[];
  favouritesPlaylist: Playlist | null;
}

/**
 * Main content component for the playlists page.
 * Displays a list of playlists and provides functionality to create new ones.
 * Redirects unauthenticated users to the home page.
 *
 * @param props - Component properties
 * @param props.playlists - Array of the user's custom playlist objects
 * @param props.favouritesPlaylist - The special favourites playlist, or null if none exists
 * @author Maruf Bepary
 */
const PlaylistsContent: React.FC<PlaylistsContentProps> = ({ playlists, favouritesPlaylist }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { isLoading, user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(ROUTES.HOME.path);
    }
  }, [isLoading, user, router]);

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = async () => {
    const parsed = CreatePlaylistSchema.safeParse({ title: newPlaylistTitle });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid playlist name");
      return;
    }

    if (!user) return;

    setIsCreating(true);

    const { error } = await supabaseClient
      .from("playlists")
      .insert({ user_id: user.id, title: parsed.data.title, is_favourites: false });

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
        <h2 className="font-semibold text-xl">Your Playlists</h2>
        <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-x-1">
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
          onClick={() => router.push(ROUTES.FAVOURITES.path)}
          size="sm"
          className="flex w-full cursor-pointer items-center gap-x-2 rounded-lg bg-muted/40 p-2 transition hover:bg-muted/80"
        >
          <div className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg bg-rose-500/10">
            <Heart className="size-5 fill-rose-500 text-rose-500" />
          </div>
          <ItemContent className="flex flex-col gap-y-1 overflow-hidden">
            <ItemTitle className="truncate text-foreground">Liked Songs</ItemTitle>
            <ItemDescription className="truncate">Your favourites</ItemDescription>
          </ItemContent>
        </Item>
      )}

      {/* Regular playlists */}
      {filteredPlaylists.length === 0 && !favouritesPlaylist ? (
        <p className="text-muted-foreground">No playlists yet. Create one to get started.</p>
      ) : filteredPlaylists.length === 0 && searchQuery ? (
        <p className="text-muted-foreground">No playlists match your search.</p>
      ) : (
        filteredPlaylists.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            data={playlist}
            onClick={(id) => router.push(ROUTES.PLAYLISTS.detail(id))}
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
