import { describe, expect, it } from "vitest";
import { FILE_LIMITS } from "@/lib/env";
import { AvatarFileSchema } from "@/schemas/user/avatar-file.schema";

function makeFile(type: string, size: number): File {
  const file = new File([], "avatar.png", { type });
  Object.defineProperty(file, "size", { value: Math.max(size, 0) });
  return file;
}

describe("AvatarFileSchema", () => {
  it("accepts a small PNG file", () => {
    expect(AvatarFileSchema.safeParse(makeFile("image/png", 1024)).success).toBe(true);
  });

  it("accepts all permitted MIME types", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp", "image/gif"]) {
      expect(AvatarFileSchema.safeParse(makeFile(type, 100)).success).toBe(true);
    }
  });

  it("rejects non-permitted MIME types", () => {
    const result = AvatarFileSchema.safeParse(makeFile("image/svg+xml", 100));
    expect(result.error?.issues[0].message).toBe("Only JPEG, PNG, WebP, or GIF files are allowed");
  });

  it("rejects files over the avatar size limit", () => {
    const result = AvatarFileSchema.safeParse(
      makeFile("image/png", FILE_LIMITS.AVATAR_MAX_BYTES + 1),
    );
    expect(result.error?.issues[0].message).toBe("Avatar must be 5 MB or smaller");
  });

  it("accepts a file exactly at the size limit", () => {
    expect(
      AvatarFileSchema.safeParse(makeFile("image/png", FILE_LIMITS.AVATAR_MAX_BYTES)).success,
    ).toBe(true);
  });

  it("rejects non-File values", () => {
    expect(AvatarFileSchema.safeParse("not-a-file").success).toBe(false);
  });
});
