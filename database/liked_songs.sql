-- Table
create table public.liked_songs (
  user_id uuid not null,
  song_id bigint not null,
  created_at timestamp with time zone null default now(),
  constraint liked_songs_pkey primary key (user_id, song_id),
  constraint liked_songs_song_id_fkey foreign KEY (song_id) references songs (id) on delete CASCADE,
  constraint liked_songs_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists liked_songs_user_idx on public.liked_songs using btree (user_id) TABLESPACE pg_default;

create index IF not exists liked_songs_song_idx on public.liked_songs using btree (song_id) TABLESPACE pg_default;


-- Policies
alter policy "Enable delete for users based on user_id"
on "public"."liked_songs"
to public
using (
    (( SELECT auth.uid() AS uid) = user_id)
);

alter policy "Enable insert for authenticated users only"
on "public"."liked_songs"
to authenticated
with check (
  true
);

alter policy "Enable read access for all users"
on "public"."liked_songs"
to public
using (
  true
);