# **Drumroll Music**

---

A full-stack music streaming application built with Next.js and Supabase. Users can authenticate (email/password or OAuth), upload songs along with album and artist metadata, browse by song, album or artist, manage playlists, and mark tracks as favourites. Search works across all entity types, and playback is handled by a persistent global player.

# Features
## Authentication
- Email/password sign‑up and sign‑in
- OAuth via Google and GitHub
- Sign‑out and password reset flows

## Music and Discovery
- Upload flow that creates or finds an artist, creates an album, and then uploads a song with audio and cover art
- Browse newest songs, latest albums, all albums, all artists, and user playlists
- Search by title/name across songs, albums, and artists with filter tabs
- Album detail pages with track listings and artist credits
- Artist detail pages showing full discographies

## Playlists & Favourites
- User‑created playlists (`/playlists`) with ordered tracks
- Special favourites playlist (`is_favourites=true`) auto‑created per user; add/remove songs via the heart button
- View favourites at `/favourites`

## Playback
- Persistent global player with queue, prev/next, seek scrubber, volume control, and favourite toggle
- Queue seeded from whatever collection is currently in view (songs, album, playlist, search results)

## Navigation
- Sidebar links: Home, Search, Songs, Albums, Artists, Playlists, Favourites
- Responsive header with search and sidebar trigger on mobile

# Stack
These are the main technologies that were used in this project:
## Front-End
- [**TypeScript**](https://www.typescriptlang.org/): TypeScript is a superset of JavaScript that adds optional static typing and other features to make the development of large-scale JavaScript applications easier and more efficient. TypeScript enables developers to catch errors earlier in the development process, write more maintainable code, and benefit from advanced editor support.
- [**Next.js**](https://nextjs.org/): Next.js is a popular React framework for building server-side rendered (SSR) and statically generated web applications. It provides a set of tools and conventions that make it easy to build modern, performant web applications that can be easily deployed to a variety of hosting environments.
- [**Tailwind CSS**](https://tailwindcss.com/):  a highly customizable, low-level CSS framework, provides utility classes that help us build out custom designs efficiently and responsively.
- [**Radix UI**](https://www.radix-ui.com/): Radix UI is a low-level, unstyled, and headless (renderless) UI component library. By being headless, Radix UI allows developers to create user interfaces with complete design freedom, providing functionality without dictating style. It delivers accessibility out-of-the-box, and works well with popular frameworks like React, thus fitting seamlessly into modern front-end development workflows.

## Back-End
- [**Supabase**](https://supabase.io/): Supabase is a powerful open-source alternative to Google's Firebase. It provides a suite of tools and services that make it easy to build and scale complex applications, including real-time databases, authentication and authorization, storage, serverless functions, and more. Supabase uses PostgreSQL as its underlying database, providing a robust and reliable data layer for your application.
- [**PostgreSQL**](https://www.postgresql.org/): PostgreSQL is a powerful, open-source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. PostgreSQL is known for its proven architecture, strong reliability, data integrity, and correctness. It's highly scalable both in the sheer quantity of data it can manage and in the number of concurrent users it can accommodate. It's utilized as the primary database for the Supabase services, bringing advanced functionalities and stability.

# Requirements
These are the requirements needed to run the project:
- Node 24 or later
- Supabase project configured with auth and storage

# Running Application Locally
These are simple steps to run the application locally. For more detail instructions, refer to the [Wiki](https://github.com/mbeps/drumroll-music/wiki).

## 1. Clone the Project Locally
You'll first need to clone the project repository to your local machine. Open your terminal, navigate to the directory where you want to store the project, and run the following command:

```sh
git clone https://github.com/mbeps/drumroll-music.git
```

## 2. Install Dependencies
Navigate to the root directory of the project by running the following command:
```sh
cd drumroll-music
```

Then, install the project dependencies by running:
```sh
yarn install
```

## 3. Set Up Environment Variables
You'll need to set up your environment variables to run the application. In the root of your project, create a `.env.local` file. The environment variables you'll need to include are:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

You'll need to fill in the value for each of these variables. Here's how to get each one:
- `NEXT_PUBLIC_SUPABASE_URL`: This is your Supabase project's unique URL. You can find this within your Supabase dashboard. Navigate to your project's settings and you will find the API URL listed there.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: This is the public publishable key for your Supabase project. It's located in your project's API settings and is safe to expose to the browser.
- `SUPABASE_SECRET_KEY`: This secret key replaces the legacy service role key naming. Handle it carefully as it grants broad privileges.

## 4. Set Up Supabase
To get your Supabase instance up and running, you'll need to do a few things:

1. **Run SQL queries**: Navigate to the `database` folder in your local project. In this folder you'll find SQL files for each table (`users.sql`, `artists.sql`, `albums.sql`, `album_artists.sql`, `songs.sql`, `playlists.sql`, `playlist_songs.sql`) plus storage policies. Execute them in dependency order (`users → artists → albums → album_artists → songs → playlists → playlist_songs`) using the Supabase SQL editor.

2. **Enable authentication providers**: This app uses Email, Google, and GitHub as authentication providers. To enable these, head over to the `Authentication` section in your Supabase dashboard, click on `Settings` and then `External OAuth Providers`. Here, you can enable and configure your providers as needed.

3. **Create storage buckets**: In Supabase, you'll need to create two buckets for storing data: 'images' and 'songs'.

   To create a bucket, navigate to the `Storage` section in your Supabase dashboard, then click on the `New bucket` button. Fill in the bucket name as `images` or `songs`, and submit the form. Repeat this step for the second bucket.

4. **Set bucket policies**: After creating your buckets, you need to set policies that allow inserting, updating, and deleting for all authenticated users.

   From the `Storage` section in your dashboard, click on a bucket name. On the bucket details page, click on the `Policies` tab. Here, you can add policies to allow operations (insert, update, delete) by adding a policy with the SQL condition to check if the user is authenticated.

Remember, setting up your Supabase environment correctly is vital for your application to function as expected. Ensure you've followed each step closely.

## 5. Run the Application
Once you've set up your environment and its variables variables, you can run the application using the following command:

```
npm run dev
```

Alternatively, you can build the whole app and run it using the follwing commands:
```sh
yarn build 
yarn start
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

# References
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React.js Documentation](https://react.dev/reference/react)
- [Supabase Documentation](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)