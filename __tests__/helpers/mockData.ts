import type { Song, SongWithAlbum, AlbumWithArtists, Artist, Album } from "@/types/types";

export const createMockArtist = (overrides?: Partial<Artist>): Artist => ({
  id: "artist-1",
  name: "Test Artist",
  imageUrl: null,
  ...overrides,
});

export const createMockAlbum = (overrides?: Partial<Album>): Album => ({
  id: "album-1",
  title: "Test Album",
  releaseDate: null,
  coverImagePath: "test-cover.jpg",
  uploaderId: "user-1",
  createdAt: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockAlbumWithArtists = (
  overrides?: Partial<AlbumWithArtists>
): AlbumWithArtists => ({
  ...createMockAlbum(),
  artists: [createMockArtist()],
  ...overrides,
});

export const createMockSong = (overrides?: Partial<Song>): Song => ({
  id: 1,
  title: "Test Song",
  albumId: "album-1",
  trackNumber: 1,
  songPath: "test-song.mp3",
  uploaderId: "user-1",
  createdAt: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockSongWithAlbum = (
  overrides?: Partial<SongWithAlbum>
): SongWithAlbum => ({
  ...createMockSong(),
  album: createMockAlbumWithArtists(),
  ...overrides,
});

// DB row format (what Supabase returns before mapping)
export const createMockSongRow = (overrides?: Record<string, unknown>) => ({
  id: 1,
  title: "Test Song",
  album_id: "album-1",
  track_number: 1,
  song_path: "test-song.mp3",
  uploader_id: "user-1",
  created_at: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockSongWithAlbumRow = (overrides?: Record<string, unknown>) => ({
  ...createMockSongRow(),
  albums: {
    id: "album-1",
    title: "Test Album",
    release_date: null,
    cover_image_path: "test-cover.jpg",
    uploader_id: "user-1",
    created_at: "2025-01-01T00:00:00.000Z",
    album_artists: [
      {
        artists: {
          id: "artist-1",
          name: "Test Artist",
          image_url: null,
          created_at: "2025-01-01T00:00:00.000Z",
        },
      },
    ],
  },
  ...overrides,
});
