import { beforeEach, describe, expect, it, vi } from "vitest";
import getSongsByTitle from "@/actions/getSongsByTitle";
import { Song } from "@/types/types";

const mockOrder = vi.fn();
const mockIlike = vi.fn(() => ({ order: mockOrder }));
const mockSelect = vi.fn(() => ({ ilike: mockIlike }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };
const mockGetSongs = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

vi.mock("@/actions/getSongs", () => ({
  default: (...args: unknown[]) => mockGetSongs(...args),
}));

describe("getSongsByTitle", () => {
  const songs: Song[] = [
    {
      id: "1",
      user_id: "user-1",
      author: "Artist 1",
      title: "My Song",
      song_path: "song-1.mp3",
      image_path: "image-1.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all songs when no title is provided", async () => {
    mockGetSongs.mockResolvedValue(songs);

    const result = await getSongsByTitle("");

    expect(mockGetSongs).toHaveBeenCalledTimes(1);
    expect(result).toEqual(songs);
  });

  it("performs a case-insensitive search by title", async () => {
    mockOrder.mockResolvedValue({ data: songs, error: null });
    mockGetSongs.mockResolvedValue([]);

    const result = await getSongsByTitle("song");

    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockIlike).toHaveBeenCalledWith("title", "%song%");
    expect(mockOrder).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual(songs);
  });

  it("returns an empty array when Supabase returns an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "oops" } });

    const result = await getSongsByTitle("missing");

    expect(result).toEqual([]);
  });
});
