import { describe, expect, it, vi, beforeEach } from "vitest";
import getSongs from "@/actions/getSongs";
import { Song } from "@/types/types";

const mockOrder = vi.fn();
const mockSelect = vi.fn(() => ({ order: mockOrder }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("getSongs", () => {
  const songs: Song[] = [
    {
      id: "1",
      user_id: "user-1",
      author: "Artist 1",
      title: "Title 1",
      song_path: "song-1.mp3",
      image_path: "image-1.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns songs ordered by creation date", async () => {
    mockOrder.mockResolvedValue({ data: songs, error: null });

    const result = await getSongs();

    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual(songs);
  });

  it("returns an empty array when there is an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "boom" } });

    const result = await getSongs();

    expect(result).toEqual([]);
  });
});
