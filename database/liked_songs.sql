CREATE TABLE public.liked_songs (
  user_id uuid NOT NULL,
  song_id bigint NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now()
);

ALTER TABLE public.liked_songs ADD CONSTRAINT liked_songs_pkey PRIMARY KEY (song_id);