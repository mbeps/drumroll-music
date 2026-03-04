import { beforeEach, describe, expect, it, vi } from "vitest";
import getFavouriteSongs from "@/actions/getFavouriteSongs";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

const songRow = createMockSongWithAlbumRow();
const mappedSong = createMockSongWithAlbum();

const mockSingle = vi.fn();
const mockReturns = vi.fn(() => ({ single: mockSingle }));
const mockEqFavourites = vi.fn(() => ({ returns: mockReturns }));
const mockEqUser = vi.fn(() => ({ eq: mockEqFavourites }));
const mockSelect = vi.fn(() => ({ eq: mockEqUser }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockGetUser = vi.fn();
const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: mockFrom,
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("getFavouriteSongs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns favourite songs for the authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSingle.mockResolvedValue({
      data: {
        playlist_songs: [{ position: 1, songs: songRow }],
      },
      error: null,
    });

    const result = await getFavouriteSongs();

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("playlists");
    expect(mockEqUser).toHaveBeenCalledWith("user_id", "user-1");
    expect(mockEqFavourites).toHaveBeenCalledWith("is_favourites", true);
    expect(result).toEqual([mappedSong]);
  });

  it("filters out rows without songs", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSingle.mockResolvedValue({
      data: {
        playlist_songs: [
          { position: 1, songs: null },
          { position: 2, songs: songRow },
        ],
      },
      error: null,
    });

    const result = await getFavouriteSongs();

    expect(result).toEqual([mappedSong]);
  });

  it("returns an empty array when no user is authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await getFavouriteSongs();

    expect(result).toEqual([]);
  });

  it("returns an empty array when no playlist data is returned", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: null, error: null });

    const result = await getFavouriteSongs();

    expect(result).toEqual([]);
  });

  it("logs and returns empty when Supabase reports auth error", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "auth failed" },
    });

    const result = await getFavouriteSongs();

    expect(consoleSpy).toHaveBeenCalledWith("auth failed");
    expect(result).toEqual([]);
  });
});
