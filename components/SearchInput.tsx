"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "./Input";
import useDebounce from "@/hooks/useDebounce";

/**
 * Allows the user to search for songs by title.
 *
 * @returns (React.FC): SearchInput component with an input field
 */
const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>(""); // search query
  const debouncedValue = useDebounce<string>(value, 500); // delay the search by 500ms

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: "/search",
      query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="Search for music"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};

export default SearchInput;
