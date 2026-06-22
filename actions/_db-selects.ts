/**
 * Shared PostgREST select clauses for efficient data loading with nested relationships.
 * These constants define the query projection for common join patterns used across Server Actions.
 * Each select string includes all related entities needed to build domain types in the frontend.
 *
 * @module actions/_db-selects
 * @author Maruf Bepary
 */

/**
 * Song with full album and artist credits.
 * Includes: song metadata, parent album, and all album_artists relationships.
 * Used by getSongs, getSongsByTitle, getSongsByUserId, getFavouriteSongs.
 */
export const SONG_WITH_ALBUM_SELECT = "*, albums(*, album_artists(artists(*)))";

/**
 * Album with all credited artists.
 * Includes: album metadata and all album_artists relationships with artist details.
 * Used by getAlbums, getAlbumsByTitle.
 */
export const ALBUM_WITH_ARTISTS_SELECT = "*, album_artists(artists(*))";

/**
 * Complete album detail hierarchy for album detail pages.
 * Includes: album metadata, all credited artists, and all songs in the album.
 * Used by getAlbumById.
 */
export const ALBUM_DETAIL_SELECT = "*, album_artists(artists(*)), songs(*)";

/**
 * Artist with all credited albums and their artists.
 * Includes: artist metadata and all album credits (each album includes its full artist roster).
 * Used by getArtistById.
 */
export const ARTIST_WITH_ALBUMS_SELECT = "*, album_artists(albums(*, album_artists(artists(*))))";

/**
 * Playlist with full song details for playlist pages.
 * Includes: playlist metadata, all playlist_songs junction records, and full song data per junction.
 * Used by getPlaylistById, getFavouriteSongs.
 */
export const PLAYLIST_WITH_SONGS_SELECT = "*, playlist_songs(*, songs(*, albums(*, album_artists(artists(*)))))";
