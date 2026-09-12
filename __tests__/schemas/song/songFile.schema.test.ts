import { describe, expect, it } from "vitest";
import { FILE_LIMITS } from "@/config/env";
import { AUDIO_ALLOWED_TYPES } from "@/schemas/song/audio-allowed-types";
import { SongFileSchema } from "@/schemas/song/song-file.schema";

function makeFile(type: string, size: number): File {
  const file = new File([], "song.mp3", { type });
  Object.defineProperty(file, "size", { value: Math.max(size, 0) });
  return file;
}

describe("SongFileSchema", () => {
  it("accepts a small MP3 file", () => {
    expect(SongFileSchema.safeParse(makeFile("audio/mpeg", 1024)).success).toBe(true);
  });

  it("accepts every permitted audio type", () => {
    for (const type of AUDIO_ALLOWED_TYPES) {
      expect(SongFileSchema.safeParse(makeFile(type, 100)).success).toBe(true);
    }
  });

  it("rejects an empty file", () => {
    const result = SongFileSchema.safeParse(makeFile("audio/mpeg", 0));
    expect(result.error?.issues[0].message).toBe("Audio file is required");
  });

  it("rejects files over the song size limit", () => {
    const result = SongFileSchema.safeParse(makeFile("audio/mpeg", FILE_LIMITS.SONG_MAX_BYTES + 1));
    expect(result.error?.issues[0].message).toBe(
      `Audio file size must be less than ${FILE_LIMITS.SONG_MAX_BYTES / (1024 * 1024)}MB`,
    );
  });

  it("rejects non-audio MIME types", () => {
    const result = SongFileSchema.safeParse(makeFile("image/png", 100));
    expect(result.error?.issues[0].message).toBe(
      "Invalid audio file type. Only MP3, WAV, OGG, and FLAC are allowed.",
    );
  });

  it("rejects non-File values", () => {
    expect(SongFileSchema.safeParse(null).success).toBe(false);
  });
});
