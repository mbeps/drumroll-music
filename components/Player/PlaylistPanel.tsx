"use client";

import { useState, KeyboardEvent } from "react";
import { Check, Plus } from "lucide-react";
import BounceLoader from "react-spinners/BounceLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAddToPlaylist from "@/hooks/useAddToPlaylist";
import PanelBackButton from "./PanelBackButton";
import type { Playlist } from "../../types/playlist";

/**
 * Props for the PlaylistPanel component.
 *
 * @author Maruf Bepary
 */
interface PlaylistPanelProps {
  /**
   * The ID of the song to add to a playlist. Passed to `useAddToPlaylist`.
   */
  songId: number;
  /**
   * Callback to navigate back, closing this panel and returning to the player tabs.
   */
  onClose: () => void;
}

/**
 * Player side-panel for adding the currently playing song to a user playlist.
 * Lists all of the user's playlists with a checkmark on any that already
 * contain the song. Also allows creating a new named playlist on the fly,
 * which immediately adds the active song to it.
 * Rendered as a tab within the player's multi-panel interface.
 *
 * @param props - See PlaylistPanelProps
 * @see useAddToPlaylist for the underlying playlist mutation logic
 * @author Maruf Bepary
 */
const PlaylistPanel: React.FC<PlaylistPanelProps> = ({ songId, onClose }) => {
  const { playlists, isLoading, addToPlaylist, createAndAdd, isInPlaylist } =
    useAddToPlaylist(songId);

  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setIsCreating(true);
    await createAndAdd(trimmed);
    setIsCreating(false);
    setNewTitle("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-x-2 p-4 border-b border-border">
        <PanelBackButton onClick={onClose} iconType="back" />
        <span className="flex-1 text-center font-semibold text-sm pr-8">
          Add to Playlist
        </span>
      </div>

      {/* Playlist list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <BounceLoader color="#ff0000" size={24} />
          </div>
        ) : playlists.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No playlists yet.
          </p>
        ) : (
          <ul>
            {playlists.map((playlist: Playlist) => (
              <li key={playlist.id}>
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-accent transition-colors"
                  onClick={() => addToPlaylist(playlist.id)}
                >
                  <span className="truncate">{playlist.title}</span>
                  {isInPlaylist(playlist.id) && (
                    <Check className="size-4 text-green-500 shrink-0 ml-2" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create new playlist */}
      <div className="p-4 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground font-medium">New playlist</p>
        <div className="flex gap-x-2">
          <Input
            placeholder="Playlist name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleCreate}
            disabled={isCreating || !newTitle.trim()}
            aria-label="Create playlist"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPanel;
