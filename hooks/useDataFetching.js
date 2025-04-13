import { useState, useEffect, useCallback } from 'react';
import CacheManager from '../utils/cache';
import SyncManager from '../utils/sync';

export function useDataFetching(key, fetchFunction, options = {}) {
  const {
    ttl,
    skipCache = false,
    dependencies = [],
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Try cache first if not skipping and not forcing refresh
        if (!skipCache && !forceRefresh) {
          const cachedData = await CacheManager.get(key);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            onSuccess?.(cachedData);
            return;
          }
        }

        // If offline and no cached data, throw error
        if (!SyncManager.isOnline) {
          throw new Error('No internet connection');
        }

        // Fetch fresh data
        const freshData = await fetchFunction();

        // Cache the fresh data
        if (!skipCache) {
          await CacheManager.set(key, freshData, ttl);
        }

        setData(freshData);
        onSuccess?.(freshData);
      } catch (err) {
        setError(err);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [key, fetchFunction, skipCache, ttl, onSuccess, onError, ...dependencies]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidateCache = useCallback(async () => {
    await CacheManager.remove(key);
  }, [key]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidateCache,
  };
}
