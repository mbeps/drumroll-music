import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateStorageForUpload } from "@/actions/storage/validate-storage-for-upload";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";

// Mock Supabase
const mockGetUser = vi.fn();
const mockSupabase = {
  auth: { getUser: mockGetUser }
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

// Mock the library validation function
vi.mock("@/lib/storage-limit/validate-storage-limits", () => ({
  validateStorageLimits: vi.fn(),
}));

describe("actions/validateStorageForUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error if user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await validateStorageForUpload(1024);
    
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Authenticated user not found");
    expect(validateStorageLimits).not.toHaveBeenCalled();
  });

  it("calls validateStorageLimits if user is authenticated", async () => {
    const userId = "test-user-id";
    mockGetUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });
    vi.mocked(validateStorageLimits).mockResolvedValue({ ok: true });
    
    const result = await validateStorageForUpload(500, 100);
    
    expect(validateStorageLimits).toHaveBeenCalledWith(500, userId, 100);
    expect(result.ok).toBe(true);
  });

  it("returns error from validateStorageLimits if it fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "uid" } }, error: null });
    vi.mocked(validateStorageLimits).mockResolvedValue({ 
      ok: false, 
      error: "Limit exceeded" 
    });
    
    const result = await validateStorageForUpload(5000);
    
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Limit exceeded");
  });
});
