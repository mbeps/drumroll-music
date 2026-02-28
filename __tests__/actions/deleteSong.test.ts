import { beforeEach, describe, expect, it, vi } from "vitest";
import deleteSong from "@/actions/deleteSong";

const mockMaybeSingle = vi.fn();
const mockSelectEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = vi.fn(() => ({ eq: mockSelectEq }));
const mockDeleteEq = vi.fn();
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }));
const mockRemove = vi.fn();
const mockStorageFrom = vi.fn(() => ({ remove: mockRemove }));
const mockFrom = vi.fn((table: string) => {
  if (table === "songs") return { select: mockSelect, delete: mockDelete };
  return {};
});
const mockGetUser = vi.fn();
const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: mockFrom,
  storage: { from: mockStorageFrom },
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

describe("deleteSong", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when no user is authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const result = await deleteSong(1);

    expect(result).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns false when the song is not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await deleteSong(1);

    expect(result).toBe(false);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns false when the user is not the uploader", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockMaybeSingle.mockResolvedValue({
      data: { song_path: "song-test-123", uploader_id: "other-user" },
      error: null,
    });

    const result = await deleteSong(1);

    expect(result).toBe(false);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns false when the delete query fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockMaybeSingle.mockResolvedValue({
      data: { song_path: "song-test-123", uploader_id: "user-1" },
      error: null,
    });
    mockDeleteEq.mockResolvedValue({ error: { message: "delete failed" } });

    const result = await deleteSong(1);

    expect(result).toBe(false);
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  it("deletes the song and removes the file from storage", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockMaybeSingle.mockResolvedValue({
      data: { song_path: "song-test-123", uploader_id: "user-1" },
      error: null,
    });
    mockDeleteEq.mockResolvedValue({ error: null });
    mockRemove.mockResolvedValue({ error: null });

    const result = await deleteSong(1);

    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockDeleteEq).toHaveBeenCalledWith("id", 1);
    expect(mockStorageFrom).toHaveBeenCalledWith("songs");
    expect(mockRemove).toHaveBeenCalledWith(["song-test-123"]);
  });
});
