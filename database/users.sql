-- Users table
create table if not exists public.users (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign key (id) references auth.users (id) on delete cascade
) tablespace pg_default;

-- RLS
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);