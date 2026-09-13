import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlbumNotFound from "@/app/albums/[id]/not-found";

describe("AlbumNotFound", () => {
  it("renders the 404 album not found title and description", () => {
    render(<AlbumNotFound />);
    expect(
      screen.getByRole("heading", { name: "404: Album Not Found", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The requested album could not be found. Try searching for another album.",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
