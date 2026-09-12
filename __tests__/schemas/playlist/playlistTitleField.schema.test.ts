import { describe, expect, it } from "vitest";
import { playlistTitleField } from "@/schemas/playlist/playlist-title-field.schema";

describe("playlistTitleField", () => {
  it("accepts a valid title", () => {
    expect(playlistTitleField.safeParse("Road Trip").success).toBe(true);
  });

  it("trims whitespace", () => {
    expect(playlistTitleField.parse("  Road Trip  ")).toBe("Road Trip");
  });

  it("rejects empty and whitespace-only titles", () => {
    expect(playlistTitleField.safeParse("").success).toBe(false);
    expect(playlistTitleField.safeParse("   ").success).toBe(false);
  });

  it("rejects missing values", () => {
    expect(playlistTitleField.safeParse(undefined).success).toBe(false);
  });

  it("rejects titles over 100 characters", () => {
    expect(playlistTitleField.safeParse("a".repeat(100)).success).toBe(true);
    expect(playlistTitleField.safeParse("a".repeat(101)).success).toBe(false);
  });
});
