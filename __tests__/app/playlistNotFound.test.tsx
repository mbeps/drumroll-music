import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PlaylistNotFound from "@/app/playlists/[id]/not-found";

describe("PlaylistNotFound", () => {
  it("renders the 404 playlist not found title and description", () => {
    render(<PlaylistNotFound />);
    expect(
      screen.getByRole("heading", { name: "404: Playlist Not Found", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The requested playlist could not be found. Try searching for another playlist.",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
