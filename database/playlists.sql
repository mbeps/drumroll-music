-- Playlists table
create table if not exists public.playlists (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  is_favourites boolean not null default false,
  created_at timestamp with time zone null default now(),
  constraint playlists_pkey primary key (id),
  constraint playlists_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
) tablespace pg_default;

-- Partial unique index: one favourites playlist per user
create unique index if not exists playlists_user_favourites_unique
  on public.playlists (user_id)
  where (is_favourites = true);

-- Indexes
create index if not exists playlists_user_id_idx on public.playlists using btree (user_id);

-- RLS
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
