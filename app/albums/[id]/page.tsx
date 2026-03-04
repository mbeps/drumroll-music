import { notFound } from "next/navigation";
import getAlbumById from "@/actions/getAlbumById";
import Header from "@/components/Header";
import AlbumDetailContent from "./components/AlbumDetailContent";

export const revalidate = 0;

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

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
