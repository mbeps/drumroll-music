import { afterEach, describe, expect, it } from "vitest";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import usePlayer from "@/hooks/usePlayer";

describe("Zustand stores", () => {
  afterEach(() => {
    usePlayer.getState().reset();
    (useAuthModal as any).setState({ isOpen: false });
    (useUploadModal as any).setState({ isOpen: false });
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

    state.setIds(["1", "2"]);
    expect(usePlayer.getState().ids).toEqual(["1", "2"]);

    state.setId("2");
    expect(usePlayer.getState().activeId).toBe("2");

    state.reset();
    expect(usePlayer.getState().ids).toEqual([]);
    expect(usePlayer.getState().activeId).toBeUndefined();
  });
});
