import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types/types";

const mockSetId = vi.fn();
const mockSetIds = vi.fn();
const mockOnOpen = vi.fn();
let mockUser: any = null;

vi.mock("@/hooks/usePlayer", () => ({
  default: () => ({
    ids: [],
    activeId: undefined,
    setId: mockSetId,
    setIds: mockSetIds,
  }),
}));

vi.mock("@/hooks/useAuthModal", () => ({
  default: () => ({ onOpen: mockOnOpen }),
}));

vi.mock("@/hooks/useUser", () => ({
  useUser: () => ({ user: mockUser }),
}));

describe("useOnPlay", () => {
  const songs: Song[] = [
    {
      id: "1",
      user_id: "user-1",
      author: "Artist",
      title: "Song",
      song_path: "song.mp3",
      image_path: "image.jpg",
    },
    {
      id: "2",
      user_id: "user-1",
      author: "Artist",
      title: "Another Song",
      song_path: "song2.mp3",
      image_path: "image2.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it("opens the auth modal when there is no user", () => {
    const { result } = renderHook(() => useOnPlay(songs));

    act(() => {
      result.current("1");
    });

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
    expect(mockSetId).not.toHaveBeenCalled();
  });

  it("sets the active song and playlist when a user exists", () => {
    mockUser = { id: "user-1" };
    const { result } = renderHook(() => useOnPlay(songs));

    act(() => {
      result.current("2");
    });

    expect(mockSetId).toHaveBeenCalledWith("2");
    expect(mockSetIds).toHaveBeenCalledWith(["1", "2"]);
  });
});
