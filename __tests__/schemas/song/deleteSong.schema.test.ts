import { describe, expect, it } from "vitest";
import { DeleteSongSchema } from "@/schemas/song/delete-song.schema";

describe("DeleteSongSchema", () => {
  it("parses a positive integer song ID", () => {
    expect(DeleteSongSchema.safeParse({ songId: 42 }).success).toBe(true);
  });

  it("rejects zero", () => {
    const result = DeleteSongSchema.safeParse({ songId: 0 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Invalid song ID");
  });

  it("rejects a negative ID", () => {
    expect(DeleteSongSchema.safeParse({ songId: -1 }).success).toBe(false);
  });

  it("rejects a non-integer ID", () => {
    expect(DeleteSongSchema.safeParse({ songId: 2.5 }).success).toBe(false);
  });
});
