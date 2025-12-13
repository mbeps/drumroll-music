import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Library from "@/components/Library";
import { Song } from "@/types/types";

const onPlayMock = vi.fn();
const openAuthMock = vi.fn();
const openUploadMock = vi.fn();
let userState: { user: any } = { user: null };

vi.mock("@/hooks/useUser", () => ({
  useUser: () => userState,
}));

vi.mock("@/hooks/useAuthModal", () => ({
  default: () => ({ onOpen: openAuthMock }),
}));

vi.mock("@/hooks/useUploadModal", () => ({
  default: () => ({ onOpen: openUploadMock }),
}));

vi.mock("@/hooks/useOnPlay", () => ({
  default: () => onPlayMock,
}));

vi.mock("@/components/MediaItem", () => ({
  __esModule: true,
  default: ({ song, onClick }: any) => (
    <button data-testid={`media-${song.id}`} onClick={() => onClick(song.id)}>
      {song.title}
    </button>
  ),
}));

describe("Library", () => {
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
    userState = { user: null };
  });

  it("opens the auth modal when the user is not logged in", () => {
    const { container } = render(<Library songs={songs} />);
    const buttons = container.querySelectorAll("svg");
    // The plus icon is the second svg rendered in the header
    fireEvent.click(buttons[1]);
    expect(openAuthMock).toHaveBeenCalledTimes(1);
  });

  it("opens the upload modal when the user is logged in", () => {
    userState = { user: { id: "user-1" } };
    const { container } = render(<Library songs={songs} />);
    const buttons = container.querySelectorAll("svg");
    fireEvent.click(buttons[1]);
    expect(openUploadMock).toHaveBeenCalledTimes(1);
  });

  it("forwards song clicks to the onPlay handler", () => {
    userState = { user: { id: "user-1" } };
    render(<Library songs={songs} />);
    fireEvent.click(screen.getByTestId("media-1"));
    expect(onPlayMock).toHaveBeenCalledWith("1");
  });
});
