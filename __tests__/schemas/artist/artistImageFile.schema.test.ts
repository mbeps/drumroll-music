import { describe, expect, it } from "vitest";
import { ArtistImageFileSchema } from "@/schemas/artist/artist-image-file.schema";

const makeFile = (type: string, size: number) => {
  const file = new File([], "img.png", { type });
  Object.defineProperty(file, "size", { value: Math.max(size, 0) });
  return file;
};

describe("ArtistImageFileSchema", () => {
  it("accepts a small image file", () => {
    expect(ArtistImageFileSchema.safeParse(makeFile("image/png", 100)).success).toBe(true);
  });

  it("rejects a non-image MIME type", () => {
    const result = ArtistImageFileSchema.safeParse(makeFile("application/pdf", 100));
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe(
        "Only image files are allowed for artist profile",
      );
  });

  it("rejects a file over 2 MB", () => {
    const result = ArtistImageFileSchema.safeParse(makeFile("image/png", 2 * 1024 * 1024 + 1));
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Artist image must be less than 2 MB");
  });

  it("accepts a file at exactly 2 MB", () => {
    expect(ArtistImageFileSchema.safeParse(makeFile("image/jpeg", 2 * 1024 * 1024)).success).toBe(
      true,
    );
  });
});
