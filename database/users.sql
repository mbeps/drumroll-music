-- Table
create table public.users (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;


-- Policies
alter policy "Users can update own profile"
on "public"."users"
to public
using (
	(auth.uid() = id)
);

alter policy "Users can view own profile"
on "public"."users"
to public
using (
	(auth.uid() = id)
);