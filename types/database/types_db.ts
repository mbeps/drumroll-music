/**
 * Database type definitions auto-generated from Supabase schema.
 * Provides complete row, insert, and update type contracts for all database tables.
 * Internal use only — prefer domain-level types in other directories for application code.
 * 
 * @file Auto-generated from Supabase. Do not edit manually.
 * @author Maruf Bepary
 * @internal
 */

// @ts-nocheck
// This file is auto-generated from Supabase and has a complex type inference issue in strict mode.
// The error does not affect runtime behavior and all the generated types work correctly.

/**
 * JSON scalar type for flexible data storage.
 * Represents any JSON-compatible value including primitives, objects, and arrays.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

/**
 * Complete Supabase database schema providing row, insert, and update operation types.
 * Supports CRUD operations on users, artists, albums, songs, playlists, and their relationships.
 * Each table includes Row (read), Insert (create), and Update (modify) type variants.
 * 
 * @interface Database
 * @property {object} public - Public schema containing all application tables and views
 * @internal Use domain-level types (Album, Song, Artist, etc.) in application code instead.
 */
export interface Database {
  public: {
    Tables: {
      /**
       * User profiles stored in `public.users` table.
       * Separate from Supabase `auth.users` — stores display metadata only.
       * 
       * @property {object} Row - User profile row as stored in database
       * @property {string} Row.id - UUID foreign key to `auth.users.id`
       * @property {string | null} Row.full_name - User's display name
       * @property {string | null} Row.avatar_url - Storage path to avatar image
       * @property {string | null} Row.created_at - Profile creation timestamp
       * @property {object} Insert - Type for INSERT operations on users table
       * @property {object} Update - Type for UPDATE operations on users table
       * @property {object} Relationships - Foreign key relationships
       */
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      /**
       * Music artists registered in `public.artists` table.
       * Tracks artist metadata and ownership for library management.
       * 
       * @property {object} Row - Artist row as stored in database
       * @property {string} Row.id - Unique UUID for the artist
       * @property {string} Row.name - Display name of the artist or creator
       * @property {string | null} Row.image_url - URL to artist profile image
       * @property {string | null} Row.uploader_id - UUID of user who created artist record
       * @property {string | null} Row.created_at - Timestamp when artist was registered
       * @property {object} Insert - Type for INSERT operations on artists table
       * @property {object} Update - Type for UPDATE operations on artists table
       * @property {object} Relationships - Foreign key to users table
       */
      artists: {
        Row: {
          id: string
          name: string
          image_url: string | null
          uploader_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          uploader_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          uploader_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      /**
       * Music albums/releases stored in `public.albums` table.
       * Tracks release metadata, cover art, and ownership for library organization.
       * Associated artists are managed separately via `album_artists` junction table.
       * 
       * @property {object} Row - Album row as stored in database
       * @property {string} Row.id - Unique UUID for the album/release
       * @property {string} Row.title - Album or release title
       * @property {string | null} Row.release_date - ISO date of release
       * @property {string | null} Row.cover_image_path - Storage path to cover artwork
       * @property {string} Row.uploader_id - UUID of user who owns the album record
       * @property {string | null} Row.created_at - Timestamp when album was added
       * @property {object} Insert - Type for INSERT operations on albums table
       * @property {object} Update - Type for UPDATE operations on albums table
       * @property {object} Relationships - Foreign key to users table
       */
      albums: {
        Row: {
          id: string
          title: string
          release_date: string | null
          cover_image_path: string | null
          uploader_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          release_date?: string | null
          cover_image_path?: string | null
          uploader_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          release_date?: string | null
          cover_image_path?: string | null
          uploader_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      /**
       * Junction table linking albums to credited artists in `public.album_artists`.
       * Implements many-to-many relationship between albums and artists.
       * Composite primary key: (album_id, artist_id).
       * 
       * @property {object} Row - Junction row as stored in database
       * @property {string} Row.album_id - UUID referencing the album
       * @property {string} Row.artist_id - UUID referencing the artist
       * @property {object} Insert - Type for INSERT operations on album_artists table
       * @property {object} Update - Type for UPDATE operations on album_artists table
       * @property {object} Relationships - Foreign keys to albums and artists tables
       */
      album_artists: {
        Row: {
          album_id: string
          artist_id: string
        }
        Insert: {
          album_id: string
          artist_id: string
        }
        Update: {
          album_id?: string
          artist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_artists_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      /**
       * Music tracks stored in `public.songs` table.
       * Each song belongs to exactly one album and has track ordering within that album.
       * Cover artwork is inherited from the parent album.
       * 
       * @property {object} Row - Song row as stored in database
       * @property {number} Row.id - Unique bigint identifier for the song
       * @property {string} Row.title - Display title of the track
       * @property {string} Row.album_id - UUID of parent album
       * @property {number} Row.track_number - Position on the album (1-indexed)
       * @property {string} Row.song_path - Storage path to audio file
       * @property {string} Row.uploader_id - UUID of user who uploaded the song
       * @property {string | null} Row.created_at - Timestamp when song was added
       * @property {object} Insert - Type for INSERT operations on songs table
       * @property {object} Update - Type for UPDATE operations on songs table
       * @property {object} Relationships - Foreign keys to albums and users tables
       */
      songs: {
        Row: {
          id: number
          title: string
          album_id: string
          track_number: number
          song_path: string
          uploader_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          title: string
          album_id: string
          track_number: number
          song_path: string
          uploader_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          album_id?: string
          track_number?: number
          song_path?: string
          uploader_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      /**
       * User-owned playlists stored in `public.playlists` table.
       * Includes both regular playlists and the special "Favourites" playlist.
       * Associated songs are managed separately via `playlist_songs` junction table.
       * 
       * @property {object} Row - Playlist row as stored in database
       * @property {string} Row.id - Unique UUID for the playlist
       * @property {string} Row.user_id - UUID of the user who owns the playlist
       * @property {string} Row.title - Display name of the playlist
       * @property {boolean} Row.is_favourites - Flag indicating if this is the Favourites collection
       * @property {string | null} Row.created_at - Timestamp when playlist was created
       * @property {object} Insert - Type for INSERT operations on playlists table
       * @property {object} Update - Type for UPDATE operations on playlists table
       * @property {object} Relationships - Foreign key to users table
       */
      playlists: {
        Row: {
          id: string
          user_id: string
          title: string
          is_favourites: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          is_favourites?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          is_favourites?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      /**
       * Junction table linking songs to playlists in `public.playlist_songs`.
       * Implements many-to-many relationship with manual ordering for custom song sequences.
       * Composite primary key: (playlist_id, song_id).
       * 
       * @property {object} Row - Junction row as stored in database
       * @property {string} Row.playlist_id - UUID of the playlist
       * @property {number} Row.song_id - Bigint ID of the song
       * @property {number} Row.position - Sort order position within the playlist (1-indexed)
       * @property {string | null} Row.added_at - Timestamp when song was added to playlist
       * @property {object} Insert - Type for INSERT operations on playlist_songs table
       * @property {object} Update - Type for UPDATE operations on playlist_songs table
       * @property {object} Relationships - Foreign keys to playlists and songs tables
       */
      playlist_songs: {
        Row: {
          playlist_id: string
          song_id: number
          position: number
          added_at: string | null
        }
        Insert: {
          playlist_id: string
          song_id: number
          position: number
          added_at?: string | null
        }
        Update: {
          playlist_id?: string
          song_id?: number
          position?: number
          added_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_global_storage_usage: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_storage_usage: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>
        : never
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]["Insert"]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>["Insert"]
        : never
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]["Update"]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>["Update"]
        : never
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"] & {})
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"] & {})
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName] &
      {}) extends infer T
    ? T extends Enums<
        PublicEnumNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        EnumName & infer TName extends keyof Database[SchemaName]["Enums"]
      >
      ? Database[SchemaName]["Enums"][TName]
      : never
    : never
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"] & {})
    ? (Database["public"]["Enums"][PublicEnumNameOrOptions] & {}) extends infer T
      ? T extends Enums<"public", infer EnumName extends keyof Enums<"public">>
        ? Enums<"public", EnumName>
        : never
      : never
    : never

/**
 * Type alias for the playlist_songs table row structure.
 * Used for type-safe queries and operations on playlist membership records.
 * Note: Direct access to Row type bypasses broken Tables generic (constraint issue with & infer syntax).
 */
export type PlaylistSongRow = Database["public"]["Tables"]["playlist_songs"]["Row"];
export type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
