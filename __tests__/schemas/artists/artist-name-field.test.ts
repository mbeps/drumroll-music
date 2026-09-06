import { describe, expect, it } from "vitest";
import { artistNameField } from "@/schemas/artists/artist-name-field";

describe("artistNameField", () => {
  it("accepts a valid name", () => {
    expect(artistNameField.safeParse("Daft Punk").success).toBe(true);
  });

  it("trims whitespace", () => {
    expect(artistNameField.parse("  Daft Punk  ")).toBe("Daft Punk");
  });

  it("rejects empty and whitespace-only names", () => {
    expect(artistNameField.safeParse("").success).toBe(false);
    expect(artistNameField.safeParse("   ").success).toBe(false);
  });

  it("rejects missing values", () => {
    expect(artistNameField.safeParse(undefined).success).toBe(false);
  });

  it("rejects names over 200 characters", () => {
    expect(artistNameField.safeParse("a".repeat(200)).success).toBe(true);
    expect(artistNameField.safeParse("a".repeat(201)).success).toBe(false);
  });
});
