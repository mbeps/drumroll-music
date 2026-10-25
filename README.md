# Music Streaming 

<img width="1000" height="625" alt="image" src="https://github.com/user-attachments/assets/3a3c3cad-70a4-49a1-a90d-83d8b3715d0c" />

---

A full-stack music streaming application built with Next.js 16 and Supabase. Users can authenticate via email or OAuth, upload songs with album and artist metadata, manage playlists, and mark tracks as favourites. Search works across all entity types, and playback is handled by a persistent global player.

# Features
## Validation
- All user inputs are validated using shared Zod schemas.
- Schemas live in a dedicated `schemas/` directory and are used by both client components and server actions for consistent, type-safe rules.
## Authentication
- Sign up with email and password.
- Log in with email and password.
- Passwordless sign-in using Passkeys (WebAuthn).
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

## User Profile Management
- View account information including display name, email, and sign-in method.
- Update profile display name with real-time feedback.
- Upload, update, and delete profile avatars (stored in self-cleaning Supabase 'images' bucket).
- Change account password with current-password verification (for email-authenticated users).
- Register, rename, and delete Passkeys (WebAuthn credentials) for passwordless authentication.
- Persistent session management with redirection from protected routes.
- Mobile-first responsive design for all account settings.
- Tabbed interface for granular control over Profile and Security settings.
- Monitor personal storage usage via a visual meter (Green/Yellow/Red status) against a 1GB per-user quota.
- View global application storage capacity and enforce dual limits (per-user and global) for uploads.
- Automatic avatar cleanup in storage when a user profile is deleted.

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
- **Node.js**: Version 26 or later (required for Next.js 16 and React 19 compatibility).
- **pnpm**: Preferred package manager (v12 or later).
- **Supabase Project**: An active project with Database, Auth, and Storage enabled.

# Stack
## Frontend
- [Next.js](https://nextjs.org/): App Router architecture for server-side rendering and routing.
- [React](https://react.dev/): Latest React features including updated hooks and actions support.
- [Tailwind CSS](https://tailwindcss.com/): Unified utility-first styling with the new v4 engine.
- [Zustand](https://zustand.docs.pmnd.rs/): Lightweight state management for player queue and UI modals.
- [Zod](https://zod.dev/): Type-safe schema validation for client and server-side data integrity. Validation rules are centralised in a `schemas/` directory and reused across forms and server actions for consistency.
- [Sonner](https://sonner.emilkowal.ski/): Rich, customizable toast notifications for consistent user feedback.
- [Lucide React](https://lucide.dev/): Consistent and accessible iconography across all interfaces.
- [Radix UI](https://www.radix-ui.com/): Accessible, headless UI primitives.
- [Shadcn UI](https://ui.shadcn.com/): Reusable component system built on Radix and Tailwind.

## Backend & Database
- [Supabase](https://supabase.com/): Backend-as-a-Service for Auth, PostgreSQL database, and Storage.
- [PostgreSQL](https://www.postgresql.org/): Relational database with RLS (Row Level Security) and GIN trigram indexes for fast search.
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs): Standardised server-side rendering helpers for Supabase.
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations): Type-safe data mutations for profile management, content uploads, and database operations.
- [LogTape](https://logtape.org/): Structured, non-blocking telemetry and column-aligned ANSI console logging for Server Actions, Middleware, and Route Handlers.

# Setting Up Project
## 1. Clone the repository
```bash
git clone https://github.com/mbeps/drumroll-music.git
cd drumroll-music
```

## 2. Install dependencies
```bash
pnpm install
```

## 3. Environment variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_USER_IDS=
SUPABASE_AUTH_SITE_URL=https://music.maruf-bepary.com
SUPABASE_AUTH_GITHUB_CLIENT_ID=your-github-client-id
SUPABASE_AUTH_GITHUB_SECRET=your-github-client-secret
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_SECRET=your-google-client-secret
NEXT_PUBLIC_MAX_SONG_SIZE_MB=20
NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB=5
NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB=2
NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB=50
NEXT_PUBLIC_USER_STORAGE_LIMIT_GB=1
NEXT_PUBLIC_MAX_AVATAR_SIZE_MB=5
LOG_LEVEL=info
```

**Required variables:**
- **NEXT_PUBLIC_SUPABASE_URL**: The API URL found in your Supabase project settings under API.
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY**: The `anon` public key found in your Supabase project settings.

**Supabase Infrastructure & OAuth Provider variables:**
- **SUPABASE_AUTH_SITE_URL**: The canonical site URL for authentication redirects (defaults to `https://music.maruf-bepary.com`).
- **SUPABASE_AUTH_GITHUB_CLIENT_ID**: GitHub OAuth Application Client ID.
- **SUPABASE_AUTH_GITHUB_SECRET**: GitHub OAuth Application Client Secret.
- **SUPABASE_AUTH_GOOGLE_CLIENT_ID**: Google Cloud OAuth Web Client ID.
- **SUPABASE_AUTH_GOOGLE_SECRET**: Google Cloud OAuth Client Secret.

**Optional file size limit variables** (defaults shown above):
- **NEXT_PUBLIC_MAX_SONG_SIZE_MB**: Maximum audio file size in megabytes for uploads.
- **NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB**: Maximum album cover image size in megabytes.
- **NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB**: Maximum artist profile image size in megabytes.
- **NEXT_PUBLIC_MAX_AVATAR_SIZE_MB**: Maximum user profile avatar size in megabytes.
- **NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB**: Maximum application-wide storage limit in gigabytes (defaults to 50GB).
- **NEXT_PUBLIC_USER_STORAGE_LIMIT_GB**: Maximum per-user storage quota in gigabytes (defaults to 1GB). Uploads are blocked if either the user or global limit is exceeded.

**Optional access control configuration:**
- **NEXT_PUBLIC_ADMIN_USER_IDS**: Comma-separated list of Supabase Auth user UUIDs granted global administrator permissions across songs, albums, artists, and playlists. Leave empty for default user-only ownership.

**Optional logging configuration:**
- **LOG_LEVEL**: Logging verbosity threshold (`debug`, `info`, `warn`, `error`, `fatal`). Defaults to `info`.
  - `info` (default): Logs all state mutations (`createSong`, `deleteSong`, `createAlbum`, `createPlaylist`, profile updates) and system warnings/errors.
  - `debug`: Enables detailed query traces (`getSongs`, `getAlbums`, etc.) and middleware session synchronization checks.

## 4. Database and platform configuration
Link your Supabase project, push database migrations, and apply declarative platform configurations:
```bash
npx supabase link --project-ref <your-project-ref>
pnpm db:push
pnpm supabase config push
```

> **Note on Admin Access**: `pnpm db:push` automatically synchronises `NEXT_PUBLIC_ADMIN_USER_IDS` from `.env.local` into Supabase Vault (`[db.vault]` in `supabase/config.toml`). Whenever admin UUIDs are modified or rotated in `.env.local`, re-run `pnpm db:push` to update the database Vault secret used by Row Level Security policies.

Alternatively, if applying migrations manually via the Supabase Dashboard SQL Editor, execute `supabase/migrations/20260616171629_initial_schema.sql` and `supabase/migrations/20261025153000_add_admin_rls_policies.sql`.

## 5. Storage setup
Storage buckets (`images` and `songs`) along with permitted MIME types and size limits are managed as Infrastructure as Code in `supabase/config.toml`. They are provisioned automatically when running `pnpm supabase config push` (or locally via `supabase start`).

# Run Application
Run the application in development:
```sh
pnpm dev
```

Alternatively, you can build the whole app and run it using the following commands:
```sh
pnpm build
pnpm start
```

> The application should now be running at [http://localhost:3000](http://localhost:3000).

# Usage
1. **Browse**: Explore the homepage to see the latest uploads.
2. **Search**: Use the search bar to find music by title. Filter results using the Songs, Albums, or Artists tabs.
3. **Play**: Click the play icon on any song tile or list item. The persistent player will appear at the bottom.
4. **Account**: Sign in to manage your profile, change your display name or password, and upload a profile avatar.
5. **Manage**: Sign in to upload your own music, create playlists, or favourite songs.

# References
- [Next.js Documentation](https://nextjs.org/docs) - App Router and React framework.
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs) - Server-side authentication and session management.
- [Supabase WebAuthn/Passkey Guide](https://supabase.com/docs/guides/auth/passkeys) - Passwordless authentication with passkeys.
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli) - Local development and declarative infrastructure management.
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) - Utility-first styling engine.
- [Zustand GitHub](https://github.com/pmndrs/zustand) - Client-side state management.
- [Dnd Kit Documentation](https://dndkit.com/) - Drag-and-drop interactions.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Type-safe application development.
- [React.js Documentation](https://react.dev/reference/react) - Component architecture and hooks.
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Relational database engine.
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction) - Accessible UI primitives.
- [LogTape Documentation](https://logtape.org/) - Structured logging for TypeScript.
