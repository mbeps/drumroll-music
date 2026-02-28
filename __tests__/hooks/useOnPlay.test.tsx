import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useOnPlay from "@/hooks/useOnPlay";
import type { SongWithAlbum } from "@/types/types";
import { createMockSongWithAlbum } from "../helpers/mockData";

const mockSetId = vi.fn();
const mockSetIds = vi.fn();
const mockOnOpen = vi.fn();
let mockUser: { id: string } | null = null;

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
  const songs: SongWithAlbum[] = [
    createMockSongWithAlbum({ id: 1, title: "Song" }),
    createMockSongWithAlbum({ id: 2, title: "Another Song" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it("opens the auth modal when there is no user", () => {
    const { result } = renderHook(() => useOnPlay(songs));

    act(() => {
      result.current(1);
    });

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
    expect(mockSetId).not.toHaveBeenCalled();
  });

  it("sets the active song and playlist when a user exists", () => {
    mockUser = { id: "user-1" };
    const { result } = renderHook(() => useOnPlay(songs));

    act(() => {
      result.current(2);
    });

    expect(mockSetId).toHaveBeenCalledWith(2);
    expect(mockSetIds).toHaveBeenCalledWith([1, 2]);
  });
});
