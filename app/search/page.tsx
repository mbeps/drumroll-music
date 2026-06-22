import getSongsByTitle from "@/actions/song/get-songs-by-title";
import getAlbumsByTitle from "@/actions/album/get-albums-by-title";
import getArtistsByName from "@/actions/artist/get-artists-by-name";
import SearchInput from "@/components/search-input";
import Header from "@/components/header";
import SearchContent from "./_components/search-content";

export const revalidate = 0;

interface SearchProps {
  searchParams: Promise<{ title?: string }>;
}

/**
 * Search page component.
 * Fetches and displays filtered results for songs, albums, and artists based on the title query.
 * 
 * @param props - Component properties.
 * @param props.searchParams - Promise containing search parameters like the title.
 */
const Search = async ({ searchParams }: SearchProps) => {
  const { title = "" } = await searchParams;

  const [songs, albums, artists] = await Promise.all([
    getSongsByTitle(title),
    getAlbumsByTitle(title),
    getArtistsByName(title),
  ]);

  return (
    <>
      <Header heading="Search">
        <SearchInput />
      </Header>
      <SearchContent songs={songs} albums={albums} artists={artists} />
    </>
  );
};

export default Search;
