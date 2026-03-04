-- Albums table
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

-- Indexes
create index if not exists albums_uploader_id_idx on public.albums using btree (uploader_id);
create index if not exists albums_title_trgm_idx on public.albums using gin (title gin_trgm_ops);

-- RLS
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
