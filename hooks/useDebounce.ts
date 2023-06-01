import { useEffect, useState } from "react";

// initiates search after a delay and not as the user is typing (after user pauses typing)
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const defaultTimeDelay = 500;

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay || defaultTimeDelay
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
