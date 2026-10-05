import { api } from "@/lib/api"; // adjust to match how your api.ts exports the axios instance
import type { CalendarData, CalendarResponse } from "@/types/calendar";
import { useCallback, useEffect, useState } from "react";

export function useCalendarYear(year: number) {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    api
      .get<CalendarResponse>("/api/calendar", { params: { year } })
      .then((r) => !cancelled && setData(r.data.data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [year, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}
