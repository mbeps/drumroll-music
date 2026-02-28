-- Playlist-Songs junction table
create table if not exists public.playlist_songs (
  playlist_id uuid not null,
  song_id bigint not null,
  position integer not null,
  added_at timestamp with time zone null default now(),
  constraint playlist_songs_pkey primary key (playlist_id, song_id),
  constraint playlist_songs_playlist_id_fkey foreign key (playlist_id) references public.playlists (id) on delete cascade,
  constraint playlist_songs_song_id_fkey foreign key (song_id) references public.songs (id) on delete cascade
) tablespace pg_default;

-- Indexes
create index if not exists playlist_songs_song_id_idx on public.playlist_songs using btree (song_id);

-- RLS
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
