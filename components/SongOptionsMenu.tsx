"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, ListEnd, ListPlus, ListStart, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-mobile";
import useFavourite from "@/hooks/useFavourite";
import useAddToPlaylist from "@/hooks/useAddToPlaylist";
import { useUser } from "@/hooks/useUser";
import usePlayer from "@/hooks/usePlayer";
import { useSessionContext } from "@/providers/SupabaseProvider";
import { cn, formatArtists } from "@/lib/utils";
import type { SongWithAlbum } from "../types/song-with-album";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Interface for SongOptionsMenu component props.
 * 
 * @author Maruf Bepary
 */
interface SongOptionsMenuProps {
  /**
   * Unique identifier for the song.
   */
  songId: number;
  /**
   * Complete metadata for the song to provide context for menus.
   */
  song: SongWithAlbum;
  /**
   * Tracks open/close state of the mobile drawer.
   */
  drawerOpen: boolean;
  /**
   * Callback function for drawer state changes.
   */
  onDrawerOpenChange: (open: boolean) => void;
}

/**
 * Enhanced context menu for song actions.
 * Provides controls for adding to playlists, toggling favourites, 
 * manipulating the playback queue (Play Next/Add to Queue), and administrative tasks like deletion.
 * Detects device type to render either a desktop dropdown or mobile drawer.
 * 
 * @param props - SongOptionsMenu props
 * @returns React functional component
 * @author Maruf Bepary
 */
const SongOptionsMenu: React.FC<SongOptionsMenuProps> = ({
  songId,
  song,
  drawerOpen,
  onDrawerOpenChange,
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { isFavourite, toggleFavourite } = useFavourite(songId);
  const { playlists, isLoading, addToPlaylist, createAndAdd, isInPlaylist } =
    useAddToPlaylist(songId);
  const { user } = useUser();
  const player = usePlayer();
  const { supabaseClient } = useSessionContext();

  const isOwner = !!user && user.id === song.uploaderId;

  // Delete confirmation state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user || !isOwner) return;
    setIsDeleting(true);
    const { error } = await supabaseClient
      .from("songs")
      .delete()
      .eq("id", songId)
      .eq("uploader_id", user.id);
    if (!error) {
      // Best-effort: remove audio file from storage
      await supabaseClient.storage.from("songs").remove([song.songPath]);
    }
    setIsDeleting(false);
    setShowConfirmDelete(false);
    if (!error) {
      if (player.activeId === songId) player.reset();
      router.refresh();
      toast.success("Song deleted");
    } else {
      toast.error("Failed to delete song");
    }
  };

  // Desktop: new playlist dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Mobile: sub-view ("main" | "playlists")
  const [mobileView, setMobileView] = useState<"main" | "playlists">("main");
  const [mobileNewPlaylistTitle, setMobileNewPlaylistTitle] = useState("");
  const [isMobileCreating, setIsMobileCreating] = useState(false);

  const handleDesktopCreate = async () => {
    if (!newPlaylistTitle.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }
    setIsCreating(true);
    await createAndAdd(newPlaylistTitle.trim());
    setIsCreating(false);
    setNewPlaylistTitle("");
    setShowCreateDialog(false);
  };

  const handleMobileCreate = async () => {
    if (!mobileNewPlaylistTitle.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }
    setIsMobileCreating(true);
    await createAndAdd(mobileNewPlaylistTitle.trim());
    setIsMobileCreating(false);
    setMobileNewPlaylistTitle("");
    onDrawerOpenChange(false);
    setMobileView("main");
  };

  const handleDrawerOpenChange = (open: boolean) => {
    onDrawerOpenChange(open);
    if (!open) setMobileView("main");
  };

  // Desktop: DropdownMenu
  if (!isMobile) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Song options"
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "absolute top-2 right-2 z-10 h-7 w-7"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                toggleFavourite();
              }}
            >
              <Heart
                className={cn(
                  "size-4",
                  isFavourite && "fill-green-500 text-green-500"
                )}
              />
              {isFavourite ? "Unlike" : "Like"}
            </DropdownMenuItem>

            {player.activeId !== undefined && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  player.playNext(song);
                  toast.success("Playing next");
                }}
              >
                <ListStart className="size-4" />
                Play next
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                player.addToQueue(song);
                toast.success("Added to queue");
              }}
            >
              <ListEnd className="size-4" />
              Add to queue
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                <ListPlus className="size-4" />
                Add to playlist
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {isLoading ? (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : (
                  <>
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToPlaylist(playlist.id);
                        }}
                      >
                        <span className="flex-1 truncate">{playlist.title}</span>
                        {isInPlaylist(playlist.id) && (
                          <Check className="ml-auto size-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCreateDialog(true);
                      }}
                    >
                      <Plus className="size-4" />
                      New playlist...
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>New playlist</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Playlist name"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDesktopCreate();
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
              <Button onClick={handleDesktopCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Delete &ldquo;{song.title}&rdquo;?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently remove the song. This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Mobile: Drawer (controlled externally via drawerOpen / onDrawerOpenChange)
  return (
    <>
    <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="truncate">{song.title}</DrawerTitle>
          <DrawerDescription className="truncate">
            By {formatArtists(song.album)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col px-4 pb-6 gap-1">
          {mobileView === "main" ? (
            <>
              <Button
                variant="ghost"
                className="justify-start gap-3"
                onClick={async () => {
                  await toggleFavourite();
                  onDrawerOpenChange(false);
                }}
              >
                <Heart
                  className={cn(
                    "size-5",
                    isFavourite && "fill-green-500 text-green-500"
                  )}
                />
                {isFavourite ? "Unlike" : "Like"}
              </Button>

              {player.activeId !== undefined && (
                <Button
                  variant="ghost"
                  className="justify-start gap-3"
                  onClick={() => {
                    player.playNext(song);
                    onDrawerOpenChange(false);
                    toast.success("Playing next");
                  }}
                >
                  <ListStart className="size-5" />
                  Play next
                </Button>
              )}

              <Button
                variant="ghost"
                className="justify-start gap-3"
                onClick={() => {
                  player.addToQueue(song);
                  onDrawerOpenChange(false);
                  toast.success("Added to queue");
                }}
              >
                <ListEnd className="size-5" />
                Add to queue
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-3"
                onClick={() => setMobileView("playlists")}
              >
                <ListPlus className="size-5" />
                Add to playlist
              </Button>

              {isOwner && (
                <Button
                  variant="ghost"
                  className="justify-start gap-3 text-destructive hover:text-destructive"
                  onClick={() => {
                    onDrawerOpenChange(false);
                    setShowConfirmDelete(true);
                  }}
                >
                  <Trash2 className="size-5" />
                  Delete
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start mb-1 text-muted-foreground"
                onClick={() => setMobileView("main")}
              >
                ← Back
              </Button>

              <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                {isLoading ? (
                  <p className="py-2 px-3 text-sm text-muted-foreground">
                    Loading...
                  </p>
                ) : playlists.length === 0 ? (
                  <p className="py-2 px-3 text-sm text-muted-foreground">
                    No playlists yet
                  </p>
                ) : (
                  playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="ghost"
                      className="justify-between"
                      onClick={async () => {
                        await addToPlaylist(playlist.id);
                        onDrawerOpenChange(false);
                        setMobileView("main");
                      }}
                    >
                      <span className="truncate">{playlist.title}</span>
                      {isInPlaylist(playlist.id) && (
                        <Check className="ml-2 size-4 shrink-0 text-green-500" />
                      )}
                    </Button>
                  ))
                )}
              </div>

              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="New playlist name"
                  value={mobileNewPlaylistTitle}
                  onChange={(e) => setMobileNewPlaylistTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleMobileCreate();
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleMobileCreate}
                  disabled={isMobileCreating}
                  aria-label="Create playlist"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>

    <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{song.title}&rdquo;?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently remove the song. This action cannot be undone.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowConfirmDelete(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SongOptionsMenu;
