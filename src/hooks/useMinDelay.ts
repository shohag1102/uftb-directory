import { useEffect, useRef, useState } from "react";

/**
 * Keeps `loading` true for at least `minMs`, even if the real request
 * finishes sooner — so skeletons always feel intentional, never flash.
 */
export function useMinDelay(actualLoading: boolean, minMs = 600) {
  const [visibleLoading, setVisibleLoading] = useState(actualLoading);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (actualLoading) {
      startedAt.current = Date.now();
      setVisibleLoading(true);
      return;
    }

    const elapsed = startedAt.current ? Date.now() - startedAt.current : minMs;
    const remaining = Math.max(minMs - elapsed, 0);

    const t = setTimeout(() => setVisibleLoading(false), remaining);
    return () => clearTimeout(t);
  }, [actualLoading, minMs]);

  return visibleLoading;
}
