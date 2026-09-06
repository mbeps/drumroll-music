import { describe, it, expect } from "vitest";
import { CreateArtistSchema } from "@/schemas/artists/create-artist.schema";
import { artistNameField } from "@/schemas/artists/artist-name-field";

describe("CreateArtistSchema", () => {
  it("parses a valid name", () => {
    expect(CreateArtistSchema.safeParse({ name: "Daft Punk" }).success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = CreateArtistSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Artist name is required");
  });

  it("rejects a name over 200 characters", () => {
    expect(CreateArtistSchema.safeParse({ name: "x".repeat(201) }).success).toBe(false);
  });
});

describe("artistNameField", () => {
  it("trims the value", () => {
    expect(artistNameField.parse("  ABBA  ")).toBe("ABBA");
  });

  it("rejects whitespace-only input", () => {
    expect(artistNameField.safeParse("   ").success).toBe(false);
  });
});
