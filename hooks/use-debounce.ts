/**
 * @fileoverview Generic debounce hook for delaying value updates.
 * Useful for deferring expensive operations like API calls until user input stabilizes.
 * @author Maruf Bepary
 */

import { useEffect, useState } from "react";

/**
 * Debounces a value change by a specified delay.
 * Returns the debounced value, which updates only after the input value has remained
 * stable for the specified duration. Useful for search inputs to avoid excessive API calls.
 *
 * @template T - The type of value being debounced.
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds (defaults to 500ms).
 * @returns The debounced value, updated only after the specified delay of inactivity.
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * // Fetch results only when debouncedSearchTerm changes
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 * @author Maruf Bepary
 */
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value); // debounced value
  const defaultTimeDelay = 500; // default delay time

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay || defaultTimeDelay
    ); // set debounced value after delay

    return () => {
      clearTimeout(timer); // clear timeout on unmount
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
