-- Artists table
create table if not exists public.artists (
  id uuid not null default gen_random_uuid(),
  name text not null,
  image_url text null,
  uploader_id uuid null references auth.users(id) on delete set null,
  created_at timestamp with time zone null default now(),
  constraint artists_pkey primary key (id)
) tablespace pg_default;

-- Migration: add uploader_id if upgrading an existing schema
alter table public.artists add column if not exists uploader_id uuid null references auth.users(id) on delete set null;

-- Indexes
create index if not exists artists_name_trgm_idx on public.artists using gin (name gin_trgm_ops);

-- RLS
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
