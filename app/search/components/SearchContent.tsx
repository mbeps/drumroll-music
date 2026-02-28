"use client";

import { Song } from "@/types/types";
import SongsGrid from "@/components/SongsGrid";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  return (
    <div className="px-6 pb-4">
      <SongsGrid songs={songs} />
    </div>
  );
};

export default SearchContent;
