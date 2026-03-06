import { notFound } from "next/navigation";
import getPlaylistById from "@/actions/getPlaylistById";
import Header from "@/components/Header";
import PlaylistDetailContent from "./components/PlaylistDetailContent";

export const revalidate = 0;

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Individual playlist page component.
 * Fetches playlist details by ID and displays the playlist detail content.
 * Redirects to 404 if the playlist is not found.
 * 
 * @param props - Component properties.
 * @param props.params - Promise containing the playlist unique identifier.
 */
const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  const { id } = await params;
  const playlist = await getPlaylistById(id);

  if (!playlist) notFound();

  return (
    <>
      <Header />
      <PlaylistDetailContent playlist={playlist} />
    </>
  );
};

export default PlaylistPage;
