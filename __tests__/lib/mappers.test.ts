import { describe, it, expect } from "vitest";
import {
  mapArtistRow,
  mapAlbumRow,
  mapAlbumWithArtistsRow,
  mapSongRow,
  mapSongWithAlbumRow,
  mapAlbumDetailRow,
  mapArtistWithAlbumsRow,
  mapPlaylistRow,
  mapPlaylistWithSongsRow,
  toSongsWithAlbum,
} from "@/lib/mappers";
import {
  createMockSongRow,
  createMockSongWithAlbumRow,
  createMockArtist,
  createMockAlbum,
  createMockSong,
  createMockAlbumWithArtists,
} from "../helpers/mockData";
import type { AlbumDetail } from "@/types/types";

describe("lib/mappers", () => {
  const mockArtistRow = {
    id: "artist-1",
    name: "Test Artist",
    image_url: "artist.jpg",
    uploader_id: "user-1",
    created_at: "2025-01-01",
  };

  const mockAlbumRow = {
    id: "album-1",
    title: "Test Album",
    release_date: "2025-01-01",
    cover_image_path: "cover.jpg",
    uploader_id: "user-1",
    created_at: "2025-01-01",
  };

  const mockSongRow = {
    id: 1,
    title: "Test Song",
    album_id: "album-1",
    track_number: 1,
    song_path: "song.mp3",
    uploader_id: "user-1",
    created_at: "2025-01-01",
  };

  const mockPlaylistRow = {
    id: "playlist-1",
    user_id: "user-1",
    title: "Test Playlist",
    is_favourites: false,
    created_at: "2025-01-01",
  };

  it("should map artist row to domain model", () => {
    const result = mapArtistRow(mockArtistRow as any);
    expect(result).toEqual({
      id: "artist-1",
      name: "Test Artist",
      imageUrl: "artist.jpg",
      uploaderId: "user-1",
    });
  });

  it("should map album row to domain model", () => {
    const result = mapAlbumRow(mockAlbumRow as any);
    expect(result).toEqual({
      id: "album-1",
      title: "Test Album",
      releaseDate: "2025-01-01",
      coverImagePath: "cover.jpg",
      uploaderId: "user-1",
      createdAt: "2025-01-01",
    });
  });

  it("should map album with artists row correctly", () => {
    const row = {
      ...mockAlbumRow,
      album_artists: [{ artists: mockArtistRow }],
    };
    const result = mapAlbumWithArtistsRow(row as any);
    expect(result.id).toBe(row.id);
    expect(result.artists).toHaveLength(1);
    expect(result.artists[0].name).toBe(mockArtistRow.name);
  });

  it("should map song row to domain model", () => {
    const result = mapSongRow(mockSongRow as any);
    expect(result).toEqual({
      id: 1,
      title: "Test Song",
      albumId: "album-1",
      trackNumber: 1,
      songPath: "song.mp3",
      uploaderId: "user-1",
      createdAt: "2025-01-01",
    });
  });

  it("should map song with album row correctly", () => {
    const row = {
      ...mockSongRow,
      albums: {
        ...mockAlbumRow,
        album_artists: [{ artists: mockArtistRow }],
      },
    };
    const result = mapSongWithAlbumRow(row as any);
    expect(result.id).toBe(row.id);
    expect(result.album.title).toBe(mockAlbumRow.title);
    expect(result.album.artists[0].name).toBe(mockArtistRow.name);
  });

  it("should map album detail row correctly", () => {
    const row = {
      ...mockAlbumRow,
      album_artists: [{ artists: mockArtistRow }],
      songs: [mockSongRow],
    };
    const result = mapAlbumDetailRow(row as any);
    expect(result.songs).toHaveLength(1);
    expect(result.songs[0].title).toBe(mockSongRow.title);
  });

  it("should map artist with albums row correctly", () => {
    const row = {
      ...mockArtistRow,
      album_artists: [
        {
          albums: {
            ...mockAlbumRow,
            album_artists: [{ artists: mockArtistRow }],
          },
        },
      ],
    };
    const result = mapArtistWithAlbumsRow(row as any);
    expect(result.albums).toHaveLength(1);
    expect(result.albums[0].title).toBe(mockAlbumRow.title);
  });

  it("should map playlist row to domain model", () => {
    const result = mapPlaylistRow(mockPlaylistRow as any);
    expect(result).toEqual({
      id: "playlist-1",
      userId: "user-1",
      title: "Test Playlist",
      isFavourites: false,
      createdAt: "2025-01-01",
    });
  });

  it("should map playlist with songs correctly", () => {
    const row = {
      ...mockPlaylistRow,
      playlist_songs: [
        {
          songs: {
            ...mockSongRow,
            albums: {
              ...mockAlbumRow,
              album_artists: [{ artists: mockArtistRow }],
            },
          },
        },
      ],
    };
    const result = mapPlaylistWithSongsRow(row as any);
    expect(result.songs).toHaveLength(1);
    expect(result.songs[0].title).toBe(mockSongRow.title);
  });

  describe("toSongsWithAlbum", () => {
    it("should transform AlbumDetail to SongWithAlbum array and sort by track number", () => {
      const albumDetail: AlbumDetail = {
        ...createMockAlbumWithArtists(),
        songs: [
          createMockSong({ id: 2, trackNumber: 2, title: "Second" }),
          createMockSong({ id: 1, trackNumber: 1, title: "First" }),
        ],
      };

      const result = toSongsWithAlbum(albumDetail);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[0].album.id).toBe(albumDetail.id);
    });
  });
});
