const ALBUMS_BASE = "/albums";
const ARTISTS_BASE = "/artists";
const PLAYLISTS_BASE = "/playlists";

/**
 * Centralized route definitions for the application.
 * Use these constants instead of hardcoding path strings in components,
 * actions, and hooks to ensure refactoring safety and a single source of truth.
 */
export const ROUTES = {
  HOME: { path: "/", name: "Home" },
  SEARCH: { path: "/search", name: "Search" },
  SONGS: { path: "/songs", name: "Songs" },
  ALBUMS: {
    path: ALBUMS_BASE,
    name: "Albums",
    detail: (id: string) => `${ALBUMS_BASE}/${id}`,
  },
  ARTISTS: {
    path: ARTISTS_BASE,
    name: "Artists",
    detail: (id: string) => `${ARTISTS_BASE}/${id}`,
  },
  PLAYLISTS: {
    path: PLAYLISTS_BASE,
    name: "Playlists",
    detail: (id: string) => `${PLAYLISTS_BASE}/${id}`,
  },
  FAVOURITES: { path: "/favourites", name: "Favourites" },
  ACCOUNT: { path: "/account", name: "Account" },
  UPLOAD: { path: "/upload", name: "Upload" },
} as const;

export type Routes = typeof ROUTES;
