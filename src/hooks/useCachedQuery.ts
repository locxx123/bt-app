import { useEffect, useState } from 'react';
import { ApiError } from '../types';
import { getCache, setCache } from '../storage/cache';
import { useNetworkStatus } from './useNetworkStatus';

export interface CachedQuery<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refreshing: boolean;
  lastUpdated: number | null;
  refresh: () => void;
}

/**
 * "Cache trước, mạng sau": hiện ngay dữ liệu đã lưu, rồi gọi API để cập nhật nếu có mạng.
 * @param reloadToken - đổi giá trị này thì tải lại (dùng sau khi đồng bộ xong)
 */
export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  reloadToken = 0,
): CachedQuery<T> {
  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Gọi API rồi lưu cache. Màn hình chỉ hiện lỗi khi chưa có dữ liệu (data = null)
  const load = async () => {
    if (!isOnline) {
      setError({ type: 'network', status: 0, message: 'Bạn đang offline và chưa có dữ liệu lưu sẵn' });
      return;
    }
    try {
      const fresh = await fetcher();
      setData(fresh);
      setLastUpdated(await setCache(key, fresh));
      setError(null);
    } catch (e) {
      setError(e as ApiError);
    }
  };

  useEffect(() => {
    (async () => {
      const cached = await getCache<T>(key);
      if (cached) {
        setData(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
      }
      await load();
      setLoading(false);
    })();
    // load và fetcher đổi ở mỗi lần render; chỉ chạy lại khi 3 giá trị dưới đây đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isOnline, reloadToken]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return { data, loading, error, refreshing, lastUpdated, refresh };
}
