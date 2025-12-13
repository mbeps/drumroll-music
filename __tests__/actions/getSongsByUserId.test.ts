import { beforeEach, describe, expect, it, vi } from "vitest";
import getSongsByUserId from "@/actions/getSongsByUserId";
import { Song } from "@/types/types";

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
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns songs for the authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: songs, error: null });

    const result = await getSongsByUserId();

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("songs");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual(songs);
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
