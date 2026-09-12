import { describe, expect, it } from "vitest";
import { RenameAlbumSchema } from "@/schemas/album/rename-album.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("RenameAlbumSchema", () => {
  it("parses a valid payload", () => {
    expect(RenameAlbumSchema.safeParse({ albumId: UUID, newTitle: "New Name" }).success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = RenameAlbumSchema.safeParse({ albumId: UUID, newTitle: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Album title is required");
  });

  it("rejects a title over 200 characters", () => {
    const result = RenameAlbumSchema.safeParse({
      albumId: UUID,
      newTitle: "a".repeat(201),
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Album title must be 200 characters or fewer");
  });

  it("accepts a title of exactly 200 characters", () => {
    expect(RenameAlbumSchema.safeParse({ albumId: UUID, newTitle: "a".repeat(200) }).success).toBe(
      true,
    );
  });

  it("trims whitespace from the title", () => {
    const result = RenameAlbumSchema.parse({ albumId: UUID, newTitle: "  Padded  " });
    expect(result.newTitle).toBe("Padded");
  });
});
