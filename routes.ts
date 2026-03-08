const ALBUMS_BASE = "/albums" as const;
const ARTISTS_BASE = "/artists" as const;
const PLAYLISTS_BASE = "/playlists" as const;

/**
 * Centralized route definitions for the application.
 * Use these constants instead of hardcoding path strings in components,
 * actions, and hooks to ensure refactoring safety and a single source of truth.
 */

export const ROUTES = {
  HOME: { path: "/" as const, name: "Home" },
  SEARCH: { path: "/search" as const, name: "Search" },
  SONGS: { path: "/songs" as const, name: "Songs" },
  ALBUMS: {
    path: ALBUMS_BASE,
    name: "Albums",
    detail: (id: string) => `${ALBUMS_BASE}/${id}` as const,
  },
  ARTISTS: {
    path: ARTISTS_BASE,
    name: "Artists",
    detail: (id: string) => `${ARTISTS_BASE}/${id}` as const,
  },
  PLAYLISTS: {
    path: PLAYLISTS_BASE,
    name: "Playlists",
    detail: (id: string) => `${PLAYLISTS_BASE}/${id}` as const,
  },
  FAVOURITES: { path: "/favourites" as const, name: "Favourites" },
  ACCOUNT: { path: "/account" as const, name: "Account" },
  UPLOAD: { path: "/upload" as const, name: "Upload" },
} as const;
