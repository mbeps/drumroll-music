-- Album-Artists junction table
create table if not exists public.album_artists (
  album_id uuid not null,
  artist_id uuid not null,
  constraint album_artists_pkey primary key (album_id, artist_id),
  constraint album_artists_album_id_fkey foreign key (album_id) references public.albums (id) on delete cascade,
  constraint album_artists_artist_id_fkey foreign key (artist_id) references public.artists (id) on delete cascade
) tablespace pg_default;

-- Indexes
create index if not exists album_artists_artist_id_idx on public.album_artists using btree (artist_id);

-- RLS
alter table public.album_artists enable row level security;

create policy "Album artists are viewable by everyone"
  on public.album_artists for select
  using (true);

create policy "Authenticated users can insert album artists"
  on public.album_artists for insert
  to authenticated
  with check (true);
