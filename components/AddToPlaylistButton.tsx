"use client";

import { useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";
import { toast } from "sonner";

import useAddToPlaylist from "@/hooks/useAddToPlaylist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddToPlaylistButtonProps {
  songId: number;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ songId }) => {
  const { playlists, isLoading, addToPlaylist, createAndAdd, isInPlaylist } =
    useAddToPlaylist(songId);

  const [open, setOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newPlaylistTitle.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    setIsCreating(true);
    await createAndAdd(newPlaylistTitle.trim());
    setIsCreating(false);
    setNewPlaylistTitle("");
    setShowCreateDialog(false);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add to playlist"
            className={cn("cursor-pointer")}
          >
            <ListPlus size={20} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0" align="end">
          <Command>
            <CommandInput placeholder="Search playlists..." />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <>
                  <CommandEmpty>No playlists found.</CommandEmpty>
                  {playlists.length > 0 && (
                    <CommandGroup heading="Your playlists">
                      {playlists.map((playlist) => (
                        <CommandItem
                          key={playlist.id}
                          value={playlist.title}
                          onSelect={() => {
                            addToPlaylist(playlist.id);
                            setOpen(false);
                          }}
                        >
                          <span className="flex-1 truncate">{playlist.title}</span>
                          {isInPlaylist(playlist.id) && (
                            <Check className="size-4 text-green-500" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>

            <CommandSeparator />

            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setShowCreateDialog(true);
                }}
              >
                <Plus className="size-4" />
                New playlist
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

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
    </>
  );
};

export default AddToPlaylistButton;
