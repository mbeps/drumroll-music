-- ============================================================
-- Global Admin Access Control Migration
--
-- Adds public.is_admin() helper reading from Supabase Vault
-- and updates table RLS policies to allow global admin access.
-- ============================================================

-- 1. Helper function: public.is_admin()
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public, vault, auth
as $$
declare
  v_uid uuid;
  v_raw text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    return false;
  end if;

  begin
    select decrypted_secret into v_raw
    from vault.decrypted_secrets
    where name = 'admin_user_ids'
    limit 1;
  exception
    when undefined_table or invalid_schema_name then
      return false;
  end;

  if v_raw is null or btrim(v_raw) = '' then
    return false;
  end if;

  return exists (
    select 1
    from unnest(string_to_array(v_raw, ',')) as token
    where btrim(token) = v_uid::text
  );
end;
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ============================================================
-- 2. Artists RLS policies
-- ============================================================
drop policy if exists "Artist uploader can update their artist" on public.artists;
create policy "Artist uploader can update their artist"
  on public.artists for update
  to authenticated
  using (uploader_id = (select auth.uid()) or (select public.is_admin()))
  with check (uploader_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Artist uploader can delete their artist" on public.artists;
create policy "Artist uploader can delete their artist"
  on public.artists for delete
  to authenticated
  using (uploader_id = (select auth.uid()) or (select public.is_admin()));

-- ============================================================
-- 3. Albums RLS policies
-- ============================================================
drop policy if exists "Users can update own albums" on public.albums;
create policy "Users can update own albums"
  on public.albums for update
  to authenticated
  using ((select auth.uid()) = uploader_id or (select public.is_admin()))
  with check ((select auth.uid()) = uploader_id or (select public.is_admin()));

drop policy if exists "Users can delete own albums" on public.albums;
create policy "Users can delete own albums"
  on public.albums for delete
  to authenticated
  using ((select auth.uid()) = uploader_id or (select public.is_admin()));

-- ============================================================
-- 4. Songs RLS policies
-- ============================================================
drop policy if exists "Users can update own songs" on public.songs;
create policy "Users can update own songs"
  on public.songs for update
  to authenticated
  using ((select auth.uid()) = uploader_id or (select public.is_admin()))
  with check ((select auth.uid()) = uploader_id or (select public.is_admin()));

drop policy if exists "Users can delete own songs" on public.songs;
create policy "Users can delete own songs"
  on public.songs for delete
  to authenticated
  using ((select auth.uid()) = uploader_id or (select public.is_admin()));

-- ============================================================
-- 5. Playlists RLS policies
-- ============================================================
drop policy if exists "Users can view own playlists" on public.playlists;
create policy "Users can view own playlists"
  on public.playlists for select
  to authenticated
  using ((select auth.uid()) = user_id or ((select public.is_admin()) and is_favourites = false));

drop policy if exists "Users can update own playlists" on public.playlists;
create policy "Users can update own playlists"
  on public.playlists for update
  to authenticated
  using (((select auth.uid()) = user_id or (select public.is_admin())) and is_favourites = false)
  with check (((select auth.uid()) = user_id or (select public.is_admin())) and is_favourites = false);

drop policy if exists "Users can delete own playlists" on public.playlists;
create policy "Users can delete own playlists"
  on public.playlists for delete
  to authenticated
  using (((select auth.uid()) = user_id or (select public.is_admin())) and is_favourites = false);

-- ============================================================
-- 6. Playlist Songs RLS policies
-- ============================================================
drop policy if exists "Users can view songs in own playlists" on public.playlist_songs;
create policy "Users can view songs in own playlists"
  on public.playlist_songs for select
  to authenticated
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and (
          playlists.user_id = (select auth.uid())
          or ((select public.is_admin()) and playlists.is_favourites = false)
        )
    )
  );

drop policy if exists "Users can add songs to own playlists" on public.playlist_songs;
create policy "Users can add songs to own playlists"
  on public.playlist_songs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and (
          playlists.user_id = (select auth.uid())
          or ((select public.is_admin()) and playlists.is_favourites = false)
        )
    )
  );

drop policy if exists "Users can remove songs from own playlists" on public.playlist_songs;
create policy "Users can remove songs from own playlists"
  on public.playlist_songs for delete
  to authenticated
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and (
          playlists.user_id = (select auth.uid())
          or ((select public.is_admin()) and playlists.is_favourites = false)
        )
    )
  );

drop policy if exists "Users can reorder songs in own playlists" on public.playlist_songs;
create policy "Users can reorder songs in own playlists"
  on public.playlist_songs for update
  to authenticated
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and (
          playlists.user_id = (select auth.uid())
          or ((select public.is_admin()) and playlists.is_favourites = false)
        )
    )
  )
  with check (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
        and (
          playlists.user_id = (select auth.uid())
          or ((select public.is_admin()) and playlists.is_favourites = false)
        )
    )
  );

