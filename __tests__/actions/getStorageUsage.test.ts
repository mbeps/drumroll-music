import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStorageUsage } from "@/actions/storage/get-storage-usage";

// Mock Supabase
const mockRPC = vi.fn();
const mockGetUser = vi.fn();
const mockSupabase = {
  rpc: mockRPC,
  auth: { getUser: mockGetUser }
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

// Mock FILE_LIMITS
vi.mock("@/lib/env", () => ({
  FILE_LIMITS: {
    USER_STORAGE_LIMIT_BYTES: 100,
    GLOBAL_STORAGE_LIMIT_BYTES: 1000,
  }
}));

describe("actions/getStorageUsage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches storage usage for a specific user ID", async () => {
    mockRPC.mockResolvedValueOnce({ data: 500, error: null }); // global
    mockRPC.mockResolvedValueOnce({ data: 50, error: null });   // user
    
    const result = await getStorageUsage("user-123");
    
    expect(mockRPC).toHaveBeenCalledWith("get_global_storage_usage");
    expect(mockRPC).toHaveBeenCalledWith("get_user_storage_usage", { p_user_id: "user-123" });
    expect(result).toEqual({
      userUsage: 50,
      userLimit: 100,
      globalUsage: 500,
      globalLimit: 1000
    });
  });

  it("falls back to current authenticated user if no ID is provided", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "auth-user-id" } }, error: null });
    mockRPC.mockResolvedValueOnce({ data: 600, error: null }); // global
    mockRPC.mockResolvedValueOnce({ data: 60, error: null });   // user
    
    const result = await getStorageUsage();
    
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockRPC).toHaveBeenCalledWith("get_user_storage_usage", { p_user_id: "auth-user-id" });
    expect(result.userUsage).toBe(60);
  });

  it("sets userUsage to 0 if no user is authenticated and no ID is provided", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockRPC.mockResolvedValue({ data: 700, error: null }); // global only
    
    const result = await getStorageUsage();
    
    expect(result.userUsage).toBe(0);
    expect(result.globalUsage).toBe(700);
  });

  it("logs error and continues if RPC fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockRPC.mockResolvedValue({ data: null, error: { message: "RPC Error" } });
    mockGetUser.mockResolvedValue({ data: { user: { id: "uid" } }, error: null });

    const result = await getStorageUsage();
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(result.globalUsage).toBe(0);
    expect(result.userUsage).toBe(0);
    
    consoleSpy.mockRestore();
  });
});
