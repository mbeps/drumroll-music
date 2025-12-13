import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useLoadImage from "@/hooks/useLoadImage";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import { Song } from "@/types/types";

const mockGetPublicUrl = vi.fn(() => ({ data: { publicUrl: "public-url" } }));
const mockStorage = {
  from: vi.fn(() => ({ getPublicUrl: mockGetPublicUrl })),
};

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabaseClient: () => ({ storage: mockStorage }),
}));

describe("file loader hooks", () => {
  const song: Song = {
    id: "1",
    user_id: "user-1",
    author: "Artist",
    title: "Song",
    song_path: "song.mp3",
    image_path: "image.jpg",
  };

  it("returns null or an empty string when no song is provided", () => {
    const { result: imageResult } = renderHook(() =>
      useLoadImage(undefined as unknown as Song)
    );
    const { result: songResult } = renderHook(() =>
      useLoadSongUrl(undefined as unknown as Song)
    );

    expect(imageResult.current).toBeNull();
    expect(songResult.current).toBe("");
  });

  it("returns the public URLs for images and songs", () => {
    const { result: imageResult } = renderHook(() => useLoadImage(song));
    const { result: songResult } = renderHook(() => useLoadSongUrl(song));

    expect(mockStorage.from).toHaveBeenCalledWith("images");
    expect(imageResult.current).toBe("public-url");
    expect(mockStorage.from).toHaveBeenCalledWith("songs");
    expect(songResult.current).toBe("public-url");
  });
});
