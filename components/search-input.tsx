"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";

/**
 * Search input field with debounced URL query synchronization.
 * Manages title-based music search across songs, albums, and artists.
 * Updates URL search params on user input with a 500ms debounce delay.
 *
 * @author Maruf Bepary
 */
const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<string>(""); // search query
  const debouncedValue = useDebounce<string>(value, 500); // delay the search by 500ms

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    });

    router.push(url);
  }, [debouncedValue, router, pathname]);

  return (
    <Input
      placeholder="Search for music"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};

export default SearchInput;
