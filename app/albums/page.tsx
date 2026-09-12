import getAlbumsByTitle from "@/actions/album/get-albums-by-title";
import AlbumsContent from "@/app/albums/_components/albums-content";
import Header from "@/components/header";
import SearchInput from "@/components/search/search-input";

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
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-background">
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
