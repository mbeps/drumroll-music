# Music Streaming 

---

A full-stack music streaming application built with Next.js 16 and Supabase. Users can authenticate via email or OAuth, upload songs with album and artist metadata, manage playlists, and mark tracks as favourites. Search works across all entity types, and playback is handled by a persistent global player.

# Features
## Authentication
- Sign up with email and password.
- Log in with email and password.
- OAuth sign-in via Google and GitHub.
- Password reset functionality.
- Protected routes for authenticated users.

## Music Discovery & Search
- Browse all available songs.
- Browse all available albums with tracklistings.
- Browse all available artists with complete discographies.
- View detailed album pages with full track information.
- View detailed artist pages with all their releases.
- Title-based search across all entity types.
- Filter search results by Songs, Albums, or Artists.
- Intuitive search interface with tabs for easy navigation.

## Playlists & Favourites
- Create custom playlists.
- Rename existing playlists.
- Delete playlists.
- Add songs to playlists.
- Remove songs from playlists.
- Drag-and-drop song reordering within playlists.
- Dedicated "Favourites" playlist for liked songs.
- One-click favourite interaction via heart icon.
- View favourite tracks in a dedicated page.

## Playback
- Persistent global media player that remains active during navigation.
- Play and pause controls.
- Skip to next track.
- Skip to previous track.
- Stop playback.
- Seek scrubbing through tracks.
- Volume control.
- Active queue management with reordering, "Play Next", and "Add to Queue" capabilities.
- Song details panel showing current track information.
- Multi-tab player (Player, Queue, Playlist, Details) for granular control.
- Dedicated Queue tab with a list view and standardized navigation.
- Shuffle and three repeat modes (off, all, one); repeat button hides when the player is minimised on mobile.
- Persistent playback state across route changes.

## Content Management
- Upload songs with album and artist metadata.
- Rename uploaded songs.
- Delete uploaded songs.
- Create new albums during song upload.
- Rename albums.
- Delete albums.
- Create new artists during song upload.
- Rename artists.
- Delete artists.
- Manage ownership of all created content.

## Responsive Design
- Optimised desktop layout with Sidebar navigation.
- Optimised mobile layout with Bottom navigation.
- Responsive design that adapts to all screen sizes.

# Requirements
- **Node.js**: Version 24 or later (required for Next.js 16 and React 19 compatibility).
- **Yarn**: Preferred package manager.
- **Supabase Project**: An active project with Database, Auth, and Storage enabled.

# Stack
## FrontendNext.js 16 
- [Next.js](https://nextjs.org/): App Router architecture for server-side rendering and routing.
- [React](https://react.dev/): Latest React features including updated hooks and actions support.
- [Tailwind CSS](https://tailwindcss.com/): Unified utility-first styling with the new v4 engine.
- [Zustand](https://zustand.docs.pmnd.rs/): Lightweight state management for player queue and UI modals.
- [Radix UI](https://www.radix-ui.com/): Accessible, headless UI primitives.
- [Shadcn UI](https://ui.shadcn.com/): Reusable component system built on Radix and Tailwind.

## Backend & Database
- [Supabase](https://supabase.com/): Backend-as-a-Service for Auth, PostgreSQL database, and Storage.
- [PostgreSQL](https://www.postgresql.org/): Relational database with RLS (Row Level Security) and GIN trigram indexes for fast search.
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs): Standardised server-side rendering helpers for Supabase.

# Design
Drumroll Music uses a monolithic Next.js App Router architecture. It prioritises server-first data fetching using Supabase server clients in `actions/` to ensure security and performance. Client-side interactivity is handled by "islands" like the global player and modal system, which use Zustand for state management. The database schema uses a relational approach with junction tables for many-to-many relationships (e.g., `album_artists` and `playlist_songs`).

# Setting Up Project
## 1. Clone the repository
```bash
git clone https://github.com/mbeps/drumroll-music.git
cd drumroll-music
```

## 2. Install dependencies
```bash
yarn install
```

## 3. Environment variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```
- **NEXT_PUBLIC_SUPABASE_URL**: The API URL found in your Supabase project settings under API.
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY**: The `anon` public key found in your Supabase project settings.

## 4. Database configuration
1. Enable the `pg_trgm` extension in your Supabase SQL Editor.
2. Execute the SQL files in `database/` in this order:
   - `users.sql`
   - `artists.sql`
   - `albums.sql`
   - `album_artists.sql`
   - `songs.sql`
   - `playlists.sql`
   - `playlist_songs.sql`
3. Customise the Storage policies using `storage.sql`.

## 5. Storage setup
Create two **Public** buckets in the Supabase Storage dashboard:
- `songs`: For mp3/audio files.
- `images`: For album cover art.

# Usage
Run the application in development:
```sh
yarn dev
```

Alternatively, you can build the whole app and run it using the following command:
```sh
yarn build
yarn start
```

> The application should now be running at [http://localhost:3000](http://localhost:3000).

1. **Browse**: Explore the homepage to see the latest uploads.
2. **Search**: Use the search bar to find music by title. Filter results using the Songs, Albums, or Artists tabs.
3. **Play**: Click the play icon on any song tile or list item. The persistent player will appear at the bottom.
4. **Manage**: Sign in to upload your own music, create playlists, or favourite songs.


# References
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Dnd Kit Documentation](https://dndkit.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React.js Documentation](https://react.dev/reference/react)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)