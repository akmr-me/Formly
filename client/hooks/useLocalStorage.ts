import { useState, useEffect } from "react";

// let demo = {
//   submission_id: "h26djmqwgr",
//   created_at: "2025-08-08T19:20:34.076Z",
//   wyn5ob5l: {
//     submissions: {
//       "26a57026-cc70-4003-9d48-5f9299c12979": {
//         value: "4552",
//         status: "saved",
//       },
//     },
//   },
// };

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = (): T => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue] as const;
}
