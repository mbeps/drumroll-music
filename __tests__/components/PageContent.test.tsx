import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PageContent from "@/app/(site)/components/PageContent";
import { Song } from "@/types/types";

const onPlayMock = vi.fn();

vi.mock("@/hooks/useOnPlay", () => ({
  default: () => onPlayMock,
}));

vi.mock("@/components/SongItem", () => ({
  __esModule: true,
  default: ({ data, onClick }: any) => (
    <button onClick={() => onClick(data.id)}>{data.title}</button>
  ),
}));

describe("PageContent", () => {
  const songs: Song[] = [
    {
      id: "1",
      user_id: "user-1",
      author: "Artist",
      title: "Track One",
      song_path: "song.mp3",
      image_path: "image.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a fallback when there are no songs", () => {
    render(<PageContent songs={[]} />);
    expect(screen.getByText("No songs available.")).toBeInTheDocument();
  });

  it("renders songs and forwards click events to onPlay", () => {
    render(<PageContent songs={songs} />);
    fireEvent.click(screen.getByText("Track One"));
    expect(onPlayMock).toHaveBeenCalledWith("1");
  });
});
