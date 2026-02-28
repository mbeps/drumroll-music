import type {
  Artist,
  Album,
  AlbumWithArtists,
  Song,
  SongWithAlbum,
  AlbumDetail,
  ArtistWithAlbums,
  Playlist,
  PlaylistWithSongs,
} from "@/types/types";
import type { Database } from "@/types/types_db";

type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];
type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];
type SongRow = Database["public"]["Tables"]["songs"]["Row"];
type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];

// Artist row → Artist domain type
export const mapArtistRow = (row: ArtistRow): Artist => ({
  id: row.id,
  name: row.name,
  imageUrl: row.image_url,
});

// Album row → Album domain type (no artists)
export const mapAlbumRow = (row: AlbumRow): Album => ({
  id: row.id,
  title: row.title,
  releaseDate: row.release_date,
  coverImagePath: row.cover_image_path,
  uploaderId: row.uploader_id,
  createdAt: row.created_at,
});

// Album row with nested album_artists → AlbumWithArtists
// The row shape from Supabase: { ...album, album_artists: [{ artists: { ...artist } }] }
export const mapAlbumWithArtistsRow = (
  row: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> }
): AlbumWithArtists => ({
  ...mapAlbumRow(row),
  artists: (row.album_artists ?? []).map((aa) => mapArtistRow(aa.artists)),
});

// Song row → Song domain type (no album)
export const mapSongRow = (row: SongRow): Song => ({
  id: row.id,
  title: row.title,
  albumId: row.album_id,
  trackNumber: row.track_number,
  songPath: row.song_path,
  uploaderId: row.uploader_id,
  createdAt: row.created_at,
});

// Song row with nested album+artists → SongWithAlbum
// The row shape: { ...song, albums: { ...album, album_artists: [{ artists: {...} }] } }
export const mapSongWithAlbumRow = (
  row: SongRow & { albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } }
): SongWithAlbum => ({
  ...mapSongRow(row),
  album: mapAlbumWithArtistsRow(row.albums),
});

// Album detail: album + artists + songs
export const mapAlbumDetailRow = (
  row: AlbumRow & {
    album_artists: Array<{ artists: ArtistRow }>;
    songs: SongRow[];
  }
): AlbumDetail => ({
  ...mapAlbumWithArtistsRow(row),
  songs: (row.songs ?? []).map(mapSongRow),
});

// Artist with albums
export const mapArtistWithAlbumsRow = (
  row: ArtistRow & {
    album_artists: Array<{ albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } }>;
  }
): ArtistWithAlbums => ({
  ...mapArtistRow(row),
  albums: (row.album_artists ?? []).map((aa) => mapAlbumWithArtistsRow(aa.albums)),
});

// AlbumDetail → SongWithAlbum[] (sorted by track number)
export const toSongsWithAlbum = (album: AlbumDetail): SongWithAlbum[] =>
  [...album.songs]
    .sort((a, b) => a.trackNumber - b.trackNumber)
    .map((song) => ({
      ...song,
      album: {
        id: album.id,
        title: album.title,
        albumType: album.albumType,
        releaseDate: album.releaseDate,
        coverImagePath: album.coverImagePath,
        uploaderId: album.uploaderId,
        createdAt: album.createdAt,
        artists: album.artists,
      },
    }));

// Playlist row → Playlist domain type
export const mapPlaylistRow = (row: PlaylistRow): Playlist => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  isFavourites: row.is_favourites,
  createdAt: row.created_at,
});

// Playlist with songs
export const mapPlaylistWithSongsRow = (
  row: PlaylistRow & {
    playlist_songs: Array<{
      songs: SongRow & { albums: AlbumRow & { album_artists: Array<{ artists: ArtistRow }> } };
    }>;
  }
): PlaylistWithSongs => ({
  ...mapPlaylistRow(row),
  songs: (row.playlist_songs ?? [])
    .map((ps) => mapSongWithAlbumRow(ps.songs)),
});
