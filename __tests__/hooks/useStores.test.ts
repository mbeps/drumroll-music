import { afterEach, describe, expect, it } from "vitest";
import { createMockSongWithAlbum } from "../helpers/mockData";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import usePlayer from "@/hooks/usePlayer";

describe("Zustand stores", () => {
  afterEach(() => {
    usePlayer.getState().reset();
    (useAuthModal as { setState: (state: Record<string, unknown>) => void }).setState({ isOpen: false });
    (useUploadModal as { setState: (state: Record<string, unknown>) => void }).setState({ isOpen: false });
  });

  it("toggles the auth modal state", () => {
    expect(useAuthModal.getState().isOpen).toBe(false);
    useAuthModal.getState().onOpen();
    expect(useAuthModal.getState().isOpen).toBe(true);
    useAuthModal.getState().onClose();
    expect(useAuthModal.getState().isOpen).toBe(false);
  });

  it("toggles the upload modal state", () => {
    expect(useUploadModal.getState().isOpen).toBe(false);
    useUploadModal.getState().onOpen();
    expect(useUploadModal.getState().isOpen).toBe(true);
    useUploadModal.getState().onClose();
    expect(useUploadModal.getState().isOpen).toBe(false);
  });

  it("manages the player queue and active song", () => {
    const state = usePlayer.getState();

    state.setIds([1, 2]);
    expect(usePlayer.getState().ids).toEqual([1, 2]);

    state.setId(2);
    expect(usePlayer.getState().activeId).toBe(2);

    state.reset();
    expect(usePlayer.getState().ids).toEqual([]);
    expect(usePlayer.getState().activeId).toBeUndefined();
  });

  it("adds a song to the queue", () => {
    const song = createMockSongWithAlbum({ id: 3, title: "Next Song" });
    usePlayer.getState().addToQueue(song);

    const state = usePlayer.getState();
    expect(state.ids).toContain(3);
    expect(state.songs).toContainEqual(song);
  });

  it("does not add a duplicate song to the queue", () => {
    const song = createMockSongWithAlbum({ id: 1 });
    usePlayer.getState().setIds([1]);
    usePlayer.getState().setSongs([song]);

    usePlayer.getState().addToQueue(song);

    const state = usePlayer.getState();
    expect(state.ids).toHaveLength(1);
    expect(state.songs).toHaveLength(1);
  });

  it("places a song to play next after the active song", () => {
    const song1 = createMockSongWithAlbum({ id: 1 });
    const song2 = createMockSongWithAlbum({ id: 2 });
    const nextSong = createMockSongWithAlbum({ id: 3 });

    usePlayer.getState().setIds([1, 2]);
    usePlayer.getState().setSongs([song1, song2]);
    usePlayer.getState().setId(1);

    usePlayer.getState().playNext(nextSong);

    const state = usePlayer.getState();
    expect(state.ids).toEqual([1, 3, 2]);
    expect(state.songs).toEqual([song1, nextSong, song2]);
  });

  it("removes a song from the queue", () => {
    const song1 = createMockSongWithAlbum({ id: 1 });
    const song2 = createMockSongWithAlbum({ id: 2 });

    usePlayer.getState().setIds([1, 2]);
    usePlayer.getState().setSongs([song1, song2]);

    usePlayer.getState().removeFromQueue(1);

    const state = usePlayer.getState();
    expect(state.ids).toEqual([2]);
    expect(state.songs).toEqual([song2]);
  });

  it("reorders the queue", () => {
    const song1 = createMockSongWithAlbum({ id: 1 });
    const song2 = createMockSongWithAlbum({ id: 2 });

    usePlayer.getState().setIds([1, 2]);
    usePlayer.getState().setSongs([song1, song2]);

    usePlayer.getState().reorderQueue([2, 1]);

    const state = usePlayer.getState();
    expect(state.ids).toEqual([2, 1]);
    expect(state.songs).toEqual([song2, song1]);
  });
});
