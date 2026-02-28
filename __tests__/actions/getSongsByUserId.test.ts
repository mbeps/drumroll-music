import { beforeEach, describe, expect, it, vi } from "vitest";
import getSongsByUserId from "@/actions/getSongsByUserId";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

const mockOrder = vi.fn();
const mockEq = vi.fn(() => ({ order: mockOrder }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockGetUser = vi.fn();
const mockSupabase = { auth: { getUser: mockGetUser }, from: mockFrom };

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("getSongsByUserId", () => {
  const songRow = createMockSongWithAlbumRow();
  const mappedSong = createMockSongWithAlbum();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns songs for the authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: [songRow], error: null });

    const result = await getSongsByUserId();

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith(SONG_WITH_ALBUM_SELECT);
    expect(mockEq).toHaveBeenCalledWith("uploader_id", "user-1");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual([mappedSong]);
  });

  it("returns an empty array when no user is authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await getSongsByUserId();

    expect(result).toEqual([]);
  });

  it("returns an empty array when Supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const result = await getSongsByUserId();

    expect(result).toEqual([]);
  });

  it("logs and returns empty when the query fails", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    const result = await getSongsByUserId();

    expect(consoleSpy).toHaveBeenCalledWith("query failed");
    expect(result).toEqual([]);
  });
});
