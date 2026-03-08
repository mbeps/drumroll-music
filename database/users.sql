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

-- Function + trigger to auto-delete avatar from storage when a user row is deleted
CREATE OR REPLACE FUNCTION public.delete_user_avatar()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'images'
    AND name LIKE 'avatars/' || OLD.id::text || '/%';
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_user_deleted
  AFTER DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_user_avatar();