import { describe, expect, it, vi, beforeEach } from "vitest";
import getSongs from "@/actions/getSongs";
import { SONG_WITH_ALBUM_SELECT } from "@/actions/_selects";
import { createMockSongWithAlbum, createMockSongWithAlbumRow } from "../helpers/mockData";

const mockOrder = vi.fn();
const mockSelect = vi.fn(() => ({ order: mockOrder }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("getSongs", () => {
  const songRow = createMockSongWithAlbumRow();
  const mappedSong = createMockSongWithAlbum();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns songs ordered by creation date", async () => {
    mockOrder.mockResolvedValue({ data: [songRow], error: null });

    const result = await getSongs();

    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith(SONG_WITH_ALBUM_SELECT);
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual([mappedSong]);
  });

  it("returns an empty array when there is an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "boom" } });

    const result = await getSongs();

    expect(result).toEqual([]);
  });
});
