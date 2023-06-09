CREATE TABLE public.songs (
  id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  created_at timestamp with time zone NULL DEFAULT now(),
  title text NULL,
  song_path text NULL,
  image_path text NULL,
  author text NULL,
  user_id uuid NULL
);

ALTER TABLE public.songs ADD CONSTRAINT songs_pkey PRIMARY KEY (id);