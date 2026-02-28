import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useLoadImage from "@/hooks/useLoadImage";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import { createMockSong } from "../helpers/mockData";

const mockGetPublicUrl = vi.fn(() => ({ data: { publicUrl: "public-url" } }));
const mockStorage = {
  from: vi.fn(() => ({ getPublicUrl: mockGetPublicUrl })),
};

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabaseClient: () => ({ storage: mockStorage }),
}));

describe("file loader hooks", () => {
  const song = createMockSong({ songPath: "song.mp3" });

  it("returns null or an empty string when no input is provided", () => {
    const { result: imageResult } = renderHook(() => useLoadImage(undefined));
    const { result: songResult } = renderHook(() => useLoadSongUrl(undefined));

    expect(imageResult.current).toBeNull();
    expect(songResult.current).toBe("");
  });

  it("returns the public URLs for images and songs", () => {
    const { result: imageResult } = renderHook(() => useLoadImage("image.jpg"));
    const { result: songResult } = renderHook(() => useLoadSongUrl(song));

    expect(mockStorage.from).toHaveBeenCalledWith("images");
    expect(imageResult.current).toBe("public-url");
    expect(mockStorage.from).toHaveBeenCalledWith("songs");
    expect(songResult.current).toBe("public-url");
  });
});
