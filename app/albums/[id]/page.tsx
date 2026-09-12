import { notFound } from "next/navigation";
import getAlbumById from "@/actions/album/get-album-by-id";
import AlbumDetailContent from "@/app/albums/[id]/_components/album-detail-content";
import Header from "@/components/header";

export const revalidate = 0;

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Individual album page component.
 * Fetches album details by ID and displays the album detail content.
 * Redirects to 404 if the album is not found.
 *
 * @param params - The route parameters containing the album ID.
 */
const AlbumPage = async ({ params }: AlbumPageProps) => {
  const { id } = await params;
  const album = await getAlbumById(id);

  if (!album) notFound();

  return (
    <>
      <Header />
      <AlbumDetailContent album={album} />
    </>
  );
};

export default AlbumPage;
