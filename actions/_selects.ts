// Shared Supabase select strings for common join patterns

/** Song with album and artists */
export const SONG_WITH_ALBUM_SELECT = "*, albums(*, album_artists(artists(*)))";

/** Album with artists */
export const ALBUM_WITH_ARTISTS_SELECT = "*, album_artists(artists(*))";

/** Album detail: album + artists + songs */
export const ALBUM_DETAIL_SELECT = "*, album_artists(artists(*)), songs(*)";

/** Artist with their albums (each album includes all its artists) */
export const ARTIST_WITH_ALBUMS_SELECT = "*, album_artists(albums(*, album_artists(artists(*))))";

/** Playlist with full song details */
export const PLAYLIST_WITH_SONGS_SELECT = "*, playlist_songs(songs(*, albums(*, album_artists(artists(*)))))";
