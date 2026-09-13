import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArtistNotFound from "@/app/artists/[id]/not-found";

describe("ArtistNotFound", () => {
  it("renders the 404 artist not found title and description", () => {
    render(<ArtistNotFound />);
    expect(
      screen.getByRole("heading", { name: "404: Artist Not Found", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The requested artist could not be found. Try searching for another artist.",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
