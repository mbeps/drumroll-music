import { redirect } from "next/navigation";
import getAlbums from "@/actions/album/get-albums";
import getArtists from "@/actions/artist/get-artists";
import getPlaylists from "@/actions/playlist/get-playlists";
import getSongs from "@/actions/song/get-songs";
import getStorageUsage from "@/actions/storage/get-storage-usage";
import AdminContent from "@/app/admin/_components/admin-content";
import Header from "@/components/header";
import { ROUTES } from "@/config/routes";
import { isAdmin } from "@/lib/auth/permissions";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export const revalidate = 0;

/**
 * Dedicated administrative dashboard page — Next.js server component.
 * Exclusively accessible to the global admin user.
 * Unauthenticated visitors and non-admin users are immediately redirected to `/`.
 *
 * @author Maruf Bepary
 */
const AdminPage = async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.HOME.path);
  }

  let isUserAdmin = isAdmin(user);
  if (!isUserAdmin) {
    const rpcRes = await supabase.rpc("is_admin");
    isUserAdmin = rpcRes?.data === true;
  }

  if (!isUserAdmin) {
    redirect(ROUTES.HOME.path);
  }

  const [storage, songs, albums, artists, playlists] = await Promise.all([
    getStorageUsage(),
    getSongs(),
    getAlbums(),
    getArtists(),
    getPlaylists(),
  ]);

  return (
    <>
      <Header heading="Admin Dashboard" />
      <AdminContent
        user={user}
        storage={storage}
        songs={songs}
        albums={albums}
        artists={artists}
        playlists={playlists}
      />
    </>
  );
};

export default AdminPage;
