import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
}

/**
 * Manages the state of the music player.
 * It stores the current song ID (activeId), the playlist of song IDs (ids),
 * and functions to set the current song (setId), set the playlist (setIds),
 * and reset the player (reset).
 */
const usePlayer = create<PlayerStore>((set) => ({
  ids: [], // list of song IDs
  activeId: undefined, // current song ID
  setId: (id: string) => set({ activeId: id }), // set the current song ID
  setIds: (ids: string[]) => set({ ids }), // set the playlist
  reset: () => set({ ids: [], activeId: undefined }), // reset the player
}));

export default usePlayer;
