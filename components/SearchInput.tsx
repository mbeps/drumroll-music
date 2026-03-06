"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";

/**
 * Handles title-based searching for the music platform.
 * It manages a debounced query and updates the current URL query parameters
 * to reflect search results dynamically as the user types.
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
