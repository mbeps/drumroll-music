import { describe, it, expect } from "vitest";
import { SongUploadSchema } from "@/schemas/songs/song-upload.schema";

describe("SongUploadSchema", () => {
  it("accepts valid song metadata", () => {
    const result = SongUploadSchema.safeParse({ songTitle: "One More Time", trackNumber: 1 });
    expect(result.success).toBe(true);
  });

  it("trims the song title", () => {
    expect(SongUploadSchema.parse({ songTitle: "  One More Time  ", trackNumber: 2 }).songTitle)
      .toBe("One More Time");
  });

  it("rejects empty or whitespace-only titles", () => {
    expect(SongUploadSchema.safeParse({ songTitle: "", trackNumber: 1 }).success).toBe(false);
    expect(SongUploadSchema.safeParse({ songTitle: "   ", trackNumber: 1 }).success).toBe(false);
  });

  it("rejects titles over 300 characters", () => {
    expect(SongUploadSchema.safeParse({ songTitle: "a".repeat(300), trackNumber: 1 }).success).toBe(true);
    expect(SongUploadSchema.safeParse({ songTitle: "a".repeat(301), trackNumber: 1 }).success).toBe(false);
  });

  it("rejects non-numeric track numbers", () => {
    const result = SongUploadSchema.safeParse({ songTitle: "T", trackNumber: "one" });
    expect(result.error?.issues[0].message).toBe("Track number must be a number");
  });

  it("rejects non-integer track numbers", () => {
    const result = SongUploadSchema.safeParse({ songTitle: "T", trackNumber: 1.5 });
    expect(result.error?.issues[0].message).toBe("Track number must be a whole number");
  });

  it("rejects zero and negative track numbers", () => {
    expect(SongUploadSchema.safeParse({ songTitle: "T", trackNumber: 0 }).success).toBe(false);
    expect(SongUploadSchema.safeParse({ songTitle: "T", trackNumber: -3 }).success).toBe(false);
  });

  it("accepts track number 1 as boundary", () => {
    expect(SongUploadSchema.safeParse({ songTitle: "T", trackNumber: 1 }).success).toBe(true);
  });
});
