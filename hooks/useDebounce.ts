import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounceValue;
}
