/**
 * Result returned by createArtist server action.
 *
 * @author Maruf Bepary
 */
export interface CreateArtistResult {
  ok: boolean;
  artistId?: string;
  error?: string;
}
