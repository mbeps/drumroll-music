import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SongsGrid from "@/components/Song/SongsGrid";
import type { SongWithAlbum } from "../../types/song-with-album";
import { createMockSongWithAlbum } from "../helpers/mockData";

const onPlayMock = vi.fn();

vi.mock("@/hooks/useOnPlay", () => ({
  default: () => onPlayMock,
}));

vi.mock("@/components/Song/SongItem", () => ({
  __esModule: true,
  default: ({ data, onClick }: { data: SongWithAlbum; onClick: (id: number) => void }) => (
    <button onClick={() => onClick(data.id)}>{data.title}</button>
  ),
}));

describe("SongsGrid", () => {
  const songs: SongWithAlbum[] = [
    createMockSongWithAlbum({ title: "Track One" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a fallback when there are no songs", () => {
    render(<SongsGrid songs={[]} />);
    expect(screen.getByText("No songs available.")).toBeInTheDocument();
  });

  it("renders songs and forwards click events to onPlay", () => {
    render(<SongsGrid songs={songs} />);
    fireEvent.click(screen.getByText("Track One"));
    expect(onPlayMock).toHaveBeenCalledWith(1);
  });
});
