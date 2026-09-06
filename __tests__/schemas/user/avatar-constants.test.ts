import { describe, it, expect } from "vitest";
import { AVATAR_ALLOWED_TYPES } from "@/schemas/user/avatar-constants";

describe("AVATAR_ALLOWED_TYPES", () => {
  it("includes JPEG, PNG, WebP, and GIF MIME types", () => {
    expect(AVATAR_ALLOWED_TYPES).toEqual(
      expect.arrayContaining(["image/jpeg", "image/png", "image/webp", "image/gif"])
    );
  });

  it("has exactly four permitted types", () => {
    expect(AVATAR_ALLOWED_TYPES).toHaveLength(4);
  });

  it("does not include audio or video types", () => {
    expect(AVATAR_ALLOWED_TYPES).not.toContain("audio/mpeg");
    expect(AVATAR_ALLOWED_TYPES).not.toContain("video/mp4");
  });
});
