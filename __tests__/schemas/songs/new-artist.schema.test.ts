import { describe, expect, it } from "vitest";
import { NewArtistSchema } from "@/schemas/songs/new-artist.schema";

describe("NewArtistSchema", () => {
  it("accepts a valid artist name", () => {
    const result = NewArtistSchema.safeParse({ name: "Daft Punk" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Daft Punk");
  });

  it("trims the name", () => {
    expect(NewArtistSchema.parse({ name: "  Daft Punk  " }).name).toBe("Daft Punk");
  });

  it("rejects empty or whitespace-only names", () => {
    expect(NewArtistSchema.safeParse({ name: "" }).success).toBe(false);
    expect(NewArtistSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects names over 200 characters", () => {
    expect(NewArtistSchema.safeParse({ name: "a".repeat(200) }).success).toBe(true);
    expect(NewArtistSchema.safeParse({ name: "a".repeat(201) }).success).toBe(false);
  });

  it("rejects missing name", () => {
    expect(NewArtistSchema.safeParse({}).success).toBe(false);
  });
});
