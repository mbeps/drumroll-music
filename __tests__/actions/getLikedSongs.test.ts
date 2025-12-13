import { beforeEach, describe, expect, it, vi } from "vitest";
import getLikedSongs from "@/actions/getLikedSongs";
import { Song } from "@/types/types";

const mockReturns = vi.fn();
const mockOrder = vi.fn(() => ({ returns: mockReturns }));
const mockEq = vi.fn(() => ({ order: mockOrder }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockGetUser = vi.fn();
const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: mockFrom,
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("getLikedSongs", () => {
  const likedSong: Song = {
    id: "1",
    user_id: "user-1",
    author: "Artist 1",
    title: "Title 1",
    song_path: "song-1.mp3",
    image_path: "image-1.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns liked songs for the authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockReturns.mockResolvedValue({
      data: [{ songs: likedSong }],
      error: null,
    });

    const result = await getLikedSongs();

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("liked_songs");
    expect(mockSelect).toHaveBeenCalledWith("*, songs(*)");
    expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual([likedSong]);
  });

  it("filters out rows without songs", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockReturns.mockResolvedValue({
      data: [{ songs: null }, { songs: likedSong }],
      error: null,
    });

    const result = await getLikedSongs();

    expect(result).toEqual([likedSong]);
  });

  it("returns an empty array when no user is authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await getLikedSongs();

    expect(result).toEqual([]);
  });

  it("returns an empty array when no data is returned", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockReturns.mockResolvedValue({ data: null, error: null });

    const result = await getLikedSongs();

    expect(result).toEqual([]);
  });

  it("logs and returns empty when Supabase reports auth error", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "auth failed" },
    });

    const result = await getLikedSongs();

    expect(consoleSpy).toHaveBeenCalledWith("auth failed");
    expect(result).toEqual([]);
  });
});
