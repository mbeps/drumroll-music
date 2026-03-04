import { beforeEach, describe, expect, it, vi } from "vitest";
import getSongsByTitle from "@/actions/getSongsByTitle";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

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
  const songRow = createMockSongWithAlbumRow();
  const mappedSong = createMockSongWithAlbum();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all songs when no title is provided", async () => {
    mockGetSongs.mockResolvedValue([mappedSong]);

    const result = await getSongsByTitle("");

    expect(mockGetSongs).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mappedSong]);
  });

  it("performs a case-insensitive search by title", async () => {
    mockOrder.mockResolvedValue({ data: [songRow], error: null });
    mockGetSongs.mockResolvedValue([]);

    const result = await getSongsByTitle("song");

    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith(SONG_WITH_ALBUM_SELECT);
    expect(mockIlike).toHaveBeenCalledWith("title", "%song%");
    expect(mockOrder).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(result).toEqual([mappedSong]);
  });

  it("returns an empty array when Supabase returns an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "oops" } });

    const result = await getSongsByTitle("missing");

    expect(result).toEqual([]);
  });
});
