-- Initial schema baseline
-- Enables pg_trgm extension for search
create extension if not exists pg_trgm with schema extensions;

-- ============================================================
-- 1. Users table
-- ============================================================
create table if not exists public.users (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign key (id) references auth.users (id) on delete cascade
) tablespace pg_default;

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Trigger function to handle new auth users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Artists table
-- ============================================================
create table if not exists public.artists (
  id uuid not null default gen_random_uuid(),
  name text not null,
  image_url text null,
  uploader_id uuid null references public.users(id) on delete set null,
  created_at timestamp with time zone null default now(),
  constraint artists_pkey primary key (id)
) tablespace pg_default;

create index if not exists artists_name_trgm_idx on public.artists using gin (name extensions.gin_trgm_ops);

alter table public.artists enable row level security;

create policy "Artists are viewable by everyone"
  on public.artists for select
  using (true);

create policy "Authenticated users can insert artists"
  on public.artists for insert
  to authenticated
  with check (true);

create policy "Artist uploader can update their artist"
  on public.artists for update
  to authenticated
  using (uploader_id = auth.uid())
  with check (uploader_id = auth.uid());

create policy "Artist uploader can delete their artist"
  on public.artists for delete
  to authenticated
  using (uploader_id = auth.uid());

-- ============================================================
-- 3. Albums table
-- ============================================================
create table if not exists public.albums (
  id uuid not null default gen_random_uuid(),
  title text not null,
  release_date date null,
  cover_image_path text null,
  uploader_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint albums_pkey primary key (id),
  constraint albums_uploader_id_fkey foreign key (uploader_id) references public.users (id) on delete cascade
) tablespace pg_default;

create index if not exists albums_uploader_id_idx on public.albums using btree (uploader_id);
create index if not exists albums_title_trgm_idx on public.albums using gin (title extensions.gin_trgm_ops);

alter table public.albums enable row level security;

create policy "Albums are viewable by everyone"
  on public.albums for select
  using (true);

create policy "Authenticated users can insert albums"
  on public.albums for insert
  to authenticated
  with check (auth.uid() = uploader_id);

create policy "Users can update own albums"
  on public.albums for update
  to authenticated
  using (auth.uid() = uploader_id);

create policy "Users can delete own albums"
  on public.albums for delete
  to authenticated
  using (auth.uid() = uploader_id);

-- ============================================================
-- 4. Album Artists junction table
-- ============================================================
create table if not exists public.album_artists (
  album_id uuid not null,
  artist_id uuid not null,
  constraint album_artists_pkey primary key (album_id, artist_id),
  constraint album_artists_album_id_fkey foreign key (album_id) references public.albums (id) on delete cascade,
  constraint album_artists_artist_id_fkey foreign key (artist_id) references public.artists (id) on delete cascade
) tablespace pg_default;

create index if not exists album_artists_artist_id_idx on public.album_artists using btree (artist_id);

alter table public.album_artists enable row level security;

create policy "Album artists are viewable by everyone"
  on public.album_artists for select
  using (true);

create policy "Authenticated users can insert album artists"
  on public.album_artists for insert
  to authenticated
  with check (true);

-- ============================================================
-- 5. Songs table
-- ============================================================
create table if not exists public.songs (
  id bigint generated by default as identity not null,
  title text not null,
  album_id uuid not null,
  track_number integer not null,
  song_path text not null,
  uploader_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint songs_pkey primary key (id),
  constraint songs_album_id_fkey foreign key (album_id) references public.albums (id) on delete cascade,
  constraint songs_uploader_id_fkey foreign key (uploader_id) references public.users (id) on delete cascade
) tablespace pg_default;

create index if not exists songs_album_id_idx on public.songs using btree (album_id);
create index if not exists songs_uploader_id_idx on public.songs using btree (uploader_id);
create index if not exists songs_title_trgm_idx on public.songs using gin (title extensions.gin_trgm_ops);

alter table public.songs enable row level security;

create policy "Songs are viewable by everyone"
  on public.songs for select
  using (true);

create policy "Authenticated users can insert songs"
  on public.songs for insert
  to authenticated
  with check (auth.uid() = uploader_id);

create policy "Users can update own songs"
  on public.songs for update
  to authenticated
  using (auth.uid() = uploader_id);

create policy "Users can delete own songs"
  on public.songs for delete
  to authenticated
  using (auth.uid() = uploader_id);

-- ============================================================
-- 6. Playlists table
-- ============================================================
create table if not exists public.playlists (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  is_favourites boolean not null default false,
  created_at timestamp with time zone null default now(),
  constraint playlists_pkey primary key (id),
  constraint playlists_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
) tablespace pg_default;

create unique index if not exists playlists_user_favourites_unique
  on public.playlists (user_id)
  where (is_favourites = true);

create index if not exists playlists_user_id_idx on public.playlists using btree (user_id);

alter table public.playlists enable row level security;

create policy "Users can view own playlists"
  on public.playlists for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own playlists"
  on public.playlists for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own playlists"
  on public.playlists for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own playlists"
  on public.playlists for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- 7. Playlist Songs junction table
-- ============================================================
create table if not exists public.playlist_songs (
  playlist_id uuid not null,
  song_id bigint not null,
  position integer not null,
  added_at timestamp with time zone null default now(),
  constraint playlist_songs_pkey primary key (playlist_id, song_id),
  constraint playlist_songs_playlist_id_fkey foreign key (playlist_id) references public.playlists (id) on delete cascade,
  constraint playlist_songs_song_id_fkey foreign key (song_id) references public.songs (id) on delete cascade
) tablespace pg_default;

create index if not exists playlist_songs_song_id_idx on public.playlist_songs using btree (song_id);

alter table public.playlist_songs enable row level security;

create policy "Users can view songs in own playlists"
  on public.playlist_songs for select
  to authenticated
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and playlists.user_id = auth.uid()
    )
  );

create policy "Users can add songs to own playlists"
  on public.playlist_songs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and playlists.user_id = auth.uid()
    )
  );

create policy "Users can remove songs from own playlists"
  on public.playlist_songs for delete
  to authenticated
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and playlists.user_id = auth.uid()
    )
  );

-- ============================================================
-- 8. Storage Limit RPC Functions
-- ============================================================
create or replace function public.get_global_storage_usage()
returns bigint
language sql
security definer
set search_path = storage, public
as $$
    select coalesce(sum((metadata->>'size')::bigint), 0)
    from storage.objects;
$$;

create or replace function public.get_user_storage_usage(p_user_id uuid)
returns bigint
language sql
security definer
set search_path = storage, public
as $$
    select coalesce(sum((metadata->>'size')::bigint), 0)
    from storage.objects
    where owner = p_user_id;
$$;

-- ============================================================
-- 9. Storage Bucket RLS Policies (storage.objects)
-- ============================================================

-- IMAGES bucket
create policy "Allow All 1ffg0oo_0"
on storage.objects for select to public
using (bucket_id = 'images'::text);

create policy "Allow All 1ffg0oo_1"
on storage.objects for update to public
using (bucket_id = 'images'::text);

create policy "Allow All 1ffg0oo_2"
on storage.objects for delete to public
using (bucket_id = 'images'::text);

create policy "Allow All 1ffg0oo_3"
on storage.objects for insert to public
with check (bucket_id = 'images'::text);

-- IMAGES bucket avatar path-scoped policies (images/avatars/{uid}/...)
create policy "Users can upload their own avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'images'
  and name like 'avatars/' || auth.uid()::text || '/%'
);

create policy "Users can update their own avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'images'
  and name like 'avatars/' || auth.uid()::text || '/%'
);

create policy "Users can delete their own avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'images'
  and name like 'avatars/' || auth.uid()::text || '/%'
);

-- SONGS bucket
create policy "Allow All 1t9jwe_0"
on storage.objects for select to public
using (bucket_id = 'songs'::text);

create policy "Allow All 1t9jwe_1"
on storage.objects for insert to public
with check (bucket_id = 'songs'::text);

create policy "Allow All 1t9jwe_2"
on storage.objects for update to public
using (bucket_id = 'songs'::text);

create policy "Allow All 1t9jwe_3"
on storage.objects for delete to public
using (bucket_id = 'songs'::text);

-- ============================================================
-- 10. Table, Sequence & Function Grants (PostgREST Data API)
-- ============================================================
grant usage on schema public to anon, authenticated, service_role;

grant select on table public.users to anon;
grant select, insert, update, delete on table public.users to authenticated;
grant all on table public.users to service_role;

grant select on table public.artists to anon;
grant select, insert, update, delete on table public.artists to authenticated;
grant all on table public.artists to service_role;

grant select on table public.albums to anon;
grant select, insert, update, delete on table public.albums to authenticated;
grant all on table public.albums to service_role;

grant select on table public.album_artists to anon;
grant select, insert, update, delete on table public.album_artists to authenticated;
grant all on table public.album_artists to service_role;

grant select on table public.songs to anon;
grant select, insert, update, delete on table public.songs to authenticated;
grant all on table public.songs to service_role;

grant select on table public.playlists to anon;
grant select, insert, update, delete on table public.playlists to authenticated;
grant all on table public.playlists to service_role;

grant select on table public.playlist_songs to anon;
grant select, insert, update, delete on table public.playlist_songs to authenticated;
grant all on table public.playlist_songs to service_role;

-- Grant sequence permissions for identity column generation (songs.id)
grant usage, select on all sequences in schema public to authenticated, service_role;

-- Grant execute permissions on RPC storage functions
grant execute on function public.get_global_storage_usage() to authenticated, service_role;
grant execute on function public.get_user_storage_usage(uuid) to authenticated, service_role;
grant execute on function public.handle_new_user() to authenticated, service_role;




