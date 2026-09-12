"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Props for the generic {@link Combobox} component.
 *
 * @author Maruf Bepary
 */
export interface ComboboxProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  onSelect: (item: T) => void;
  onCreate: (query: string) => void;
  createLabel: string;
  placeholder: string;
  disabled?: boolean;
}

/**
 * A searchable dropdown component for selecting or creating items.
 *
 * @param props - Component properties.
 * @author Maruf Bepary
 */
export default function Combobox<T>({
  items,
  getLabel,
  getId,
  onSelect,
  onCreate,
  createLabel,
  placeholder,
  disabled,
}: ComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    getLabel(item).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
      />
      <div className="max-h-52 overflow-y-auto rounded-md border">
        {filtered.map((item) => (
          <button
            key={getId(item)}
            type="button"
            className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
            onClick={() => onSelect(item)}
            disabled={disabled}
          >
            {getLabel(item)}
          </button>
        ))}
        <button
          type="button"
          className="flex w-full items-center gap-x-1 px-3 py-2 text-left text-primary text-sm transition-colors hover:bg-accent"
          onClick={() => onCreate(query)}
          disabled={disabled}
        >
          <Plus className="h-3 w-3" />
          {createLabel}
          {query && ` "${query}"`}
        </button>
      </div>
    </div>
  );
}
