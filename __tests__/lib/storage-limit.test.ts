import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGlobalStorageUsage } from "@/lib/storage-limit/get-global-storage-usage";
import { getUserStorageUsage } from "@/lib/storage-limit/get-user-storage-usage";
import { validateGlobalStorageLimit } from "@/lib/storage-limit/validate-global-storage-limit";
import { validateUserStorageLimit } from "@/lib/storage-limit/validate-user-storage-limit";
import { validateStorageLimits } from "@/lib/storage-limit/validate-storage-limits";
import { getFileSize } from "@/lib/storage-limit/get-file-size";

// Mock Supabase
const mockRPC = vi.fn();
const mockList = vi.fn();
const mockFromStorage = vi.fn(() => ({ list: mockList }));
const mockSupabase = {
  rpc: mockRPC,
  storage: { from: mockFromStorage }
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

describe("lib/storage-limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGlobalStorageUsage", () => {
    it("returns total usage from RPC", async () => {
      mockRPC.mockResolvedValue({ data: 500, error: null });
      const result = await getGlobalStorageUsage();
      expect(result).toBe(500);
      expect(mockRPC).toHaveBeenCalledWith("get_global_storage_usage");
    });

    it("returns 0 if RPC fails", async () => {
      mockRPC.mockResolvedValue({ data: null, error: { message: "error" } });
      const result = await getGlobalStorageUsage();
      expect(result).toBe(0);
    });
  });

  describe("getUserStorageUsage", () => {
    it("returns user usage from RPC", async () => {
      mockRPC.mockResolvedValue({ data: 50, error: null });
      const result = await getUserStorageUsage("user-1");
      expect(result).toBe(50);
      expect(mockRPC).toHaveBeenCalledWith("get_user_storage_usage", { p_user_id: "user-1" });
    });

    it("returns 0 and logs error if RPC fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockRPC.mockResolvedValue({ data: null, error: { message: "error" } });
      const result = await getUserStorageUsage("user-1");
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("validateGlobalStorageLimit", () => {
    it("returns ok: true when within limit", async () => {
      mockRPC.mockResolvedValue({ data: 900, error: null });
      const result = await validateGlobalStorageLimit(50); // 900 + 50 = 950 < 1000
      expect(result.ok).toBe(true);
    });

    it("returns error info when exceeding limit", async () => {
      mockRPC.mockResolvedValue({ data: 950, error: null });
      const result = await validateGlobalStorageLimit(60); // 950 + 60 = 1010 > 1000
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Application storage limit reached");
    });

    it("handles file replacement (net increase)", async () => {
      mockRPC.mockResolvedValue({ data: 990, error: null });
      // Replacing 50 byte file with 40 byte file (net -10)
      const result = await validateGlobalStorageLimit(40, 50); 
      expect(result.ok).toBe(true);
    });
  });

  describe("validateUserStorageLimit", () => {
    it("returns ok: true when within user limit", async () => {
      mockRPC.mockResolvedValue({ data: 80, error: null });
      const result = await validateUserStorageLimit(15, "user-1"); // 80 + 15 = 95 < 100
      expect(result.ok).toBe(true);
    });

    it("returns error info when exceeding user limit", async () => {
      mockRPC.mockResolvedValue({ data: 80, error: null });
      const result = await validateUserStorageLimit(25, "user-1"); // 80 + 25 = 105 > 100
      expect(result.ok).toBe(false);
      expect(result.error).toContain("personal storage limit reached");
    });
  });

  describe("validateStorageLimits", () => {
    it("returns ok: true when both limits are satisfied", async () => {
      // User: 50 + 10 = 60 < 100
      // Global: 500 + 10 = 510 < 1000
      mockRPC
        .mockResolvedValueOnce({ data: 50, error: null }) // User
        .mockResolvedValueOnce({ data: 500, error: null }); // Global
        
      const result = await validateStorageLimits(10, "user-1");
      expect(result.ok).toBe(true);
    });

    it("fails early if user limit is exceeded", async () => {
      mockRPC.mockResolvedValue({ data: 95, error: null });
      const result = await validateStorageLimits(10, "user-1");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("personal storage limit");
      // Should not even call global usage
      expect(mockRPC).toHaveBeenCalledTimes(1);
    });

    it("fails if global limit is exceeded even if user limit passes", async () => {
      mockRPC
        .mockResolvedValueOnce({ data: 50, error: null }) // User OK
        .mockResolvedValueOnce({ data: 995, error: null }); // Global FAIL
        
      const result = await validateStorageLimits(10, "user-1");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Application storage limit reached");
    });
  });

  describe("getFileSize", () => {
    it("returns 0 if path is empty", async () => {
      const result = await getFileSize("songs", "");
      expect(result).toBe(0);
    });

    it("returns size of the file", async () => {
      mockList.mockResolvedValue({ 
        data: [{ name: "test.mp3", metadata: { size: 1234 } }], 
        error: null 
      });
      
      const result = await getFileSize("songs", "folder/test.mp3");
      expect(mockFromStorage).toHaveBeenCalledWith("songs");
      expect(mockList).toHaveBeenCalledWith("folder", expect.anything());
      expect(result).toBe(1234);
    });

    it("returns 0 if file is not found", async () => {
      mockList.mockResolvedValue({ data: [], error: null });
      const result = await getFileSize("songs", "non-existent.mp3");
      expect(result).toBe(0);
    });

    it("returns 0 if data is null", async () => {
      mockList.mockResolvedValue({ data: null, error: null });
      const result = await getFileSize("songs", "null-data.mp3");
      expect(result).toBe(0);
    });

    it("returns 0 if list fails", async () => {
      mockList.mockResolvedValue({ data: null, error: { message: "error" } });
      const result = await getFileSize("songs", "error.mp3");
      expect(result).toBe(0);
    });
  });
});
