-- Artists table
create table if not exists public.artists (
  id uuid not null default gen_random_uuid(),
  name text not null,
  image_url text null,
  created_at timestamp with time zone null default now(),
  constraint artists_pkey primary key (id)
) tablespace pg_default;

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
