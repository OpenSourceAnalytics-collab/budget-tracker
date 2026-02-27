import { useState, useCallback, useEffect } from 'react';

// Generic localStorage-backed state hook, now in plain JavaScript.
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key && e.newValue) {
        setStored(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [stored, setValue];
}

