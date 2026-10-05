import { api } from "@/lib/api";
import type {
  NoticeDetailResponse,
  NoticeItem,
  NoticeListResponse,
} from "@/types/notice";
import { useCallback, useEffect, useState } from "react";

export function useLatestNotices(limit = 5) {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<NoticeListResponse>("/api/notices", { params: { limit, page: 1 } })
      .then((res) => setNotices(res.data.data))
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { notices, loading, error, refresh: load };
}

export function useInfiniteNotices(limit = 10) {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<NoticeListResponse>("/api/notices", { params: { limit, page: 1 } })
      .then((res) => {
        setItems(res.data.data);
        setPage(1);
        setHasMore(res.data.pagination.hasNextPage);
      })
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    api
      .get<NoticeListResponse>("/api/notices", {
        params: { limit, page: nextPage },
      })
      .then((res) => {
        setItems((prev) => [...prev, ...res.data.data]);
        setPage(nextPage);
        setHasMore(res.data.pagination.hasNextPage);
      })
      .finally(() => setLoadingMore(false));
  }, [limit, page, hasMore, loadingMore]);

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

export function useNoticeDetail(id: string) {
  const [item, setItem] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get<NoticeDetailResponse>(`/api/notices/${id}`)
      .then((res) => active && setItem(res.data.data))
      .catch((e) => active && setError(e?.message ?? "Failed to load"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return { item, loading, error };
}
