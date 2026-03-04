import { create } from "zustand";
import type { SongWithAlbum, RepeatMode } from "@/types/types";
import { REPEAT_MODES } from "@/types/types";

/**
 * Zustand store for managing the global audio player state.
 * Handles the current track, the playback queue, and queue operations.
 * 
 * @author Maruf Bepary
 */
interface PlayerStore {
  /**
   * List of song IDs in the current queue.
   */
  ids: number[];
  /**
   * Full metadata for songs in the current queue.
   */
  songs: SongWithAlbum[];
  /**
   * The ID of the currently playing song.
   */
  activeId?: number;
  /**
   * The current repeat mode of the player.
   * @see RepeatMode
   */
  repeatMode: RepeatMode;
  /**
   * Sets the currently active song ID.
   * 
   * @param id - The ID of the song to play
   */
  setId: (id: number) => void;
  /**
   * Sets the current repeat mode of the player.
   * 
   * @param mode - The {@link RepeatMode} to set
   */
  setRepeatMode: (mode: RepeatMode) => void;
  /**
   * Cycles through the available {@link RepeatMode} values: OFF -> ALL -> ONE -> OFF.
   */
  toggleRepeatMode: () => void;
  /**
   * Sets the list of song IDs for the queue.
   * 
   * @param ids - Array of song IDs
   */
  setIds: (ids: number[]) => void;
  /**
   * Sets the list of full song objects for the queue.
   * 
   * @param songs - Array of SongWithAlbum objects
   */
  setSongs: (songs: SongWithAlbum[]) => void;
  /**
   * Adds a single song to the end of the queue if it's not already present.
   * 
   * @param song - The song to add
   */
  addToQueue: (song: SongWithAlbum) => void;
  /**
   * Places a song immediately after the currently playing song.
   * 
   * @param song - The song to play next
   */
  playNext: (song: SongWithAlbum) => void;
  /**
   * Removes a song from the queue by its ID.
   * 
   * @param id - The ID of the song to remove
   */
  removeFromQueue: (id: number) => void;
  /**
   * Reorders the queue based on a new array of IDs.
   * 
   * @param newIds - The new ordered array of song IDs
   */
  reorderQueue: (newIds: number[]) => void;
  /**
   * Resets the player store to its initial empty state.
   * Clears the audio queue and stops all playback.
   */
  reset: () => void;
}

/**
 * Hook for accessing and interacting with the player store.
 * 
 * @author Maruf Bepary
 */
const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  songs: [],
  activeId: undefined,
  repeatMode: "OFF",

  setId: (id) => set({ activeId: id }),

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleRepeatMode: () =>
    set((state) => {
      const currentIndex = REPEAT_MODES.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % REPEAT_MODES.length;
      return { repeatMode: REPEAT_MODES[nextIndex] };
    }),

  setIds: (ids) => set({ ids }),

  setSongs: (songs) => set({ songs }),

  addToQueue: (song) =>
    set((state) => {
      if (state.ids.includes(song.id)) return state;
      return {
        ids: [...state.ids, song.id],
        songs: [...state.songs, song],
      };
    }),

  playNext: (song) =>
    set((state) => {
      // Remove the song first, then find the active index in the filtered list.
      // This avoids an off-by-one when the moved song sits before the active song.
      const filteredIds = state.ids.filter((id) => id !== song.id);
      const filteredSongs = state.songs.filter((s) => s.id !== song.id);

      const activeIndex = filteredIds.findIndex((id) => id === state.activeId);
      const insertAt = activeIndex === -1 ? filteredIds.length : activeIndex + 1;

      const newIds = [
        ...filteredIds.slice(0, insertAt),
        song.id,
        ...filteredIds.slice(insertAt),
      ];
      const newSongs = [
        ...filteredSongs.slice(0, insertAt),
        song,
        ...filteredSongs.slice(insertAt),
      ];

      return { ids: newIds, songs: newSongs };
    }),

  removeFromQueue: (id) =>
    set((state) => ({
      ids: state.ids.filter((i) => i !== id),
      songs: state.songs.filter((s) => s.id !== id),
    })),

  reorderQueue: (newIds) =>
    set((state) => {
      const songMap = new Map(state.songs.map((s) => [s.id, s]));
      const newSongs = newIds
        .map((id) => songMap.get(id))
        .filter((s): s is SongWithAlbum => s !== undefined);
      return { ids: newIds, songs: newSongs };
    }),

  reset: () => set({ ids: [], songs: [], activeId: undefined }),
}));

export default usePlayer;
