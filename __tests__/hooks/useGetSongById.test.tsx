import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useGetSongById from "@/hooks/useGetSongById";
import { Song } from "@/types/types";

const fetchResponse = { data: null as Song | null, error: null as any };

const mockSingle = vi.fn(async () => fetchResponse);
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };
const toastError = vi.fn();

vi.mock("@/providers/SupabaseProvider", () => ({
  useSessionContext: () => ({ supabaseClient: mockSupabase }),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
  },
}));

describe("useGetSongById", () => {
  const song: Song = {
    id: "123",
    user_id: "user-1",
    author: "Artist",
    title: "Song",
    song_path: "song.mp3",
    image_path: "image.jpg",
  };

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
    fetchResponse.data = song;

    const { result } = renderHook(() => useGetSongById("123"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("id", "123");
    expect(result.current.song).toEqual(song);
  });

  it("handles errors when fetching a song", async () => {
    fetchResponse.error = { message: "not found" };

    const { result } = renderHook(() => useGetSongById("missing"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.song).toBeUndefined();
    expect(toastError).toHaveBeenCalledWith("Could not play/fetch song(s)");
  });
});
