"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "./Input";
import useDebounce from "@/hooks/useDebounce";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

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
