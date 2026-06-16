import getAlbumsByTitle from "@/actions/album/get-albums-by-title";
import Header from "@/components/header";
import SearchInput from "@/components/search-input";
import AlbumsContent from "./_components/albums-content";

export const revalidate = 0;

interface AlbumsPageProps {
  searchParams: Promise<{ title?: string }>;
}

/**
 * Albums page component.
 * Fetches and displays a list of albums, optionally filtered by title.
 * 
 * @param searchParams - The search parameters from the URL.
 */
const AlbumsPage = async ({ searchParams }: AlbumsPageProps) => {
  const { title = "" } = await searchParams;
  const albums = await getAlbumsByTitle(title);

  return (
    <div className="bg-background rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header heading="Albums">
        <div className="mb-2 flex flex-col gap-y-6">
          <SearchInput />
        </div>
      </Header>
      <AlbumsContent albums={albums} />
    </div>
  );
};

export default AlbumsPage;
