import { notFound } from "next/navigation";
import getAlbumById from "@/actions/getAlbumById";
import Header from "@/components/Header";
import AlbumDetailContent from "./components/AlbumDetailContent";

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
