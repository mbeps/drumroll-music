import type { AlbumWithArtists } from "@/types/music/album-with-artists";

/**
 * Result returned by createAlbum server action.
 *
 * @author Maruf Bepary
 */
export interface CreateAlbumResult {
  ok: boolean;
  album?: AlbumWithArtists;
  error?: string;
}
