import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useGetSongById from "@/hooks/useGetSongById";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

const songRow = createMockSongWithAlbumRow({ id: 123 });
const mappedSong = createMockSongWithAlbum({ id: 123 });

const fetchResponse = { data: null as typeof songRow | null, error: null as { message: string } | null };

const mockSingle = vi.fn(async () => fetchResponse);
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };
const toastError = vi.fn();

vi.mock("@/providers/SupabaseProvider", () => ({
  useSessionContext: () => ({ supabaseClient: mockSupabase }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
  },
}));

describe("useGetSongById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchResponse.data = null;
    fetchResponse.error = null;
  });

  it("does nothing when no id is provided", () => {
    const { result } = renderHook(() => useGetSongById(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.song).toBeUndefined();
  });

  it("fetches a song by id", async () => {
    fetchResponse.data = songRow;

    const { result } = renderHook(() => useGetSongById(123));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith(SONG_WITH_ALBUM_SELECT);
    expect(mockEq).toHaveBeenCalledWith("id", 123);
    expect(result.current.song).toEqual(mappedSong);
  });

  it("handles errors when fetching a song", async () => {
    fetchResponse.error = { message: "not found" };

    const { result } = renderHook(() => useGetSongById(999));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.song).toBeUndefined();
    expect(toastError).toHaveBeenCalledWith("Could not play/fetch song(s)");
  });
});
