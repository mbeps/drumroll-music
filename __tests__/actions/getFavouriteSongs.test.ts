import { beforeEach, describe, expect, it, vi } from "vitest";
import getFavouriteSongs from "@/actions/playlist/get-favourite-songs";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

const mockLogger = {
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

vi.mock("@/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    error: vi.fn((...args) => mockLogger.error(...args)),
    warn: vi.fn((...args) => mockLogger.warn(...args)),
    info: vi.fn((...args) => mockLogger.info(...args)),
    debug: vi.fn((...args) => mockLogger.debug(...args)),
  })),
}));

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
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "auth failed" },
    });

    const result = await getFavouriteSongs();

    expect(mockLogger.error).toHaveBeenCalledWith(
      "Authentication failed or user not found: {message}",
      { message: "auth failed" }
    );
    expect(result).toEqual([]);
  });
});
