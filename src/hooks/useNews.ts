import { api } from "@/lib/api";
import type {
    NewsDetailResponse,
    NewsItem,
    NewsListResponse,
} from "@/types/news";
import { useCallback, useEffect, useState } from "react";

/** Home page: latest N, with pull-to-refresh */
export function useLatestNews(limit = 5) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      api
        .get<NewsListResponse>("/api/news", { params: { limit } })
        .then((res) => setNews(res.data.data))
        .catch((e) => setError(e?.message ?? "Failed to load"))
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    [limit],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { news, loading, refreshing, error, refresh: () => load(true) };
}

/** /news route: cursor-based infinite scroll */
export function useInfiniteNews(limit = 10) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<NewsListResponse>("/api/news", { params: { limit } })
      .then((res) => {
        setItems(res.data.data);
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      })
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !cursor) return;
    setLoadingMore(true);
    api
      .get<NewsListResponse>("/api/news", { params: { limit, cursor } })
      .then((res) => {
        setItems((prev) => [...prev, ...res.data.data]);
        setCursor(res.data.pagination.nextCursor);
        setHasMore(res.data.pagination.hasMore);
      })
      .finally(() => setLoadingMore(false));
  }, [limit, cursor, hasMore, loadingMore]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload: loadInitial,
  };
}

/** Single news item for the detail page */
export function useNewsDetail(id: string) {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get<NewsDetailResponse>(`/api/news/${id}`)
      .then((res) => active && setItem(res.data.data))
      .catch((e) => active && setError(e?.message ?? "Failed to load"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return { item, loading, error };
}
