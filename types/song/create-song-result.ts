/**
 * Result returned by createSong server action.
 *
 * @author Maruf Bepary
 */
export interface CreateSongResult {
  ok: boolean;
  songId?: number;
  error?: string;
}
