import { describe, expect, it } from "vitest";
import { ROUTES } from "@/config/routes";

describe("ROUTES", () => {
  it("returns the correct static routes", () => {
    expect(ROUTES.HOME.path).toBe("/");
    expect(ROUTES.SEARCH.path).toBe("/search");
    expect(ROUTES.SONGS.path).toBe("/songs");
    expect(ROUTES.FAVOURITES.path).toBe("/favourites");
    expect(ROUTES.ACCOUNT.path).toBe("/account");
    expect(ROUTES.UPLOAD.path).toBe("/upload");
  });

  it("returns base paths and builds dynamic routes for albums", () => {
    expect(ROUTES.ALBUMS.path).toBe("/albums");
    expect(ROUTES.ALBUMS.detail("album-123")).toBe("/albums/album-123");
  });

  it("returns base paths and builds dynamic routes for artists", () => {
    expect(ROUTES.ARTISTS.path).toBe("/artists");
    expect(ROUTES.ARTISTS.detail("artist-456")).toBe("/artists/artist-456");
  });

  it("returns base paths and builds dynamic routes for playlists", () => {
    expect(ROUTES.PLAYLISTS.path).toBe("/playlists");
    expect(ROUTES.PLAYLISTS.detail("playlist-789")).toBe("/playlists/playlist-789");
  });

  it("retains descriptive names for navigation", () => {
    expect(ROUTES.HOME.name).toBe("Home");
    expect(ROUTES.ALBUMS.name).toBe("Albums");
    expect(ROUTES.ARTISTS.name).toBe("Artists");
    expect(ROUTES.PLAYLISTS.name).toBe("Playlists");
  });
});
