import { useState, useEffect, useCallback } from 'react'

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  storage?: 'localStorage' | 'sessionStorage' | 'memory'
}

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl?: number
}

// In-memory cache for session-based caching
const memoryCache = new Map<string, CacheItem<any>>()

/**
 * Hook for caching data with TTL support and multiple storage options
 */
export function useCache<T>(
  key: string,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, storage = 'memory' } = options // Default 5 minutes TTL
  const [cachedData, setCachedData] = useState<T | null>(null)

  const getStorageEngine = () => {
    switch (storage) {
      case 'localStorage':
        return localStorage
      case 'sessionStorage':
        return sessionStorage
      default:
        return null
    }
  }

  const getCachedItem = useCallback((): CacheItem<T> | null => {
    try {
      if (storage === 'memory') {
        return memoryCache.get(key) || null
      }

      const storageEngine = getStorageEngine()
      if (!storageEngine) return null

      const cached = storageEngine.getItem(key)
      if (!cached) return null

      return JSON.parse(cached)
    } catch (error) {
      console.warn(`Cache get error for key "${key}":`, error)
      return null
    }
  }, [key, storage])

  const setCacheItem = useCallback((data: T) => {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }

    try {
      if (storage === 'memory') {
        memoryCache.set(key, cacheItem)
      } else {
        const storageEngine = getStorageEngine()
        if (storageEngine) {
          storageEngine.setItem(key, JSON.stringify(cacheItem))
        }
      }
      setCachedData(data)
    } catch (error) {
      console.warn(`Cache set error for key "${key}":`, error)
    }
  }, [key, storage, ttl])

  const removeCacheItem = useCallback(() => {
    try {
      if (storage === 'memory') {
        memoryCache.delete(key)
      } else {
        const storageEngine = getStorageEngine()
        if (storageEngine) {
          storageEngine.removeItem(key)
        }
      }
      setCachedData(null)
    } catch (error) {
      console.warn(`Cache remove error for key "${key}":`, error)
    }
  }, [key, storage])

  const isExpired = useCallback((item: CacheItem<T>): boolean => {
    if (!item.ttl) return false
    return Date.now() - item.timestamp > item.ttl
  }, [])

  const getCache = useCallback((): T | null => {
    const item = getCachedItem()
    if (!item) return null

    if (isExpired(item)) {
      removeCacheItem()
      return null
    }

    return item.data
  }, [getCachedItem, isExpired, removeCacheItem])

  const setCache = useCallback((data: T) => {
    setCacheItem(data)
  }, [setCacheItem])

  const clearCache = useCallback(() => {
    removeCacheItem()
  }, [removeCacheItem])

  const refreshCache = useCallback(async (fetcher: () => Promise<T>) => {
    try {
      const data = await fetcher()
      setCache(data)
      return data
    } catch (error) {
      console.error(`Cache refresh error for key "${key}":`, error)
      throw error
    }
  }, [key, setCache])

  // Load cached data on mount
  useEffect(() => {
    const cached = getCache()
    if (cached) {
      setCachedData(cached)
    }
  }, [getCache])

  return {
    data: cachedData,
    getCache,
    setCache,
    clearCache,
    refreshCache,
    isStale: () => {
      const item = getCachedItem()
      return !item || isExpired(item)
    }
  }
}

/**
 * Higher-order function to create cached versions of API calls
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getCacheKey: (...args: Parameters<T>) => string,
  options: CacheOptions = {}
) {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const cacheKey = getCacheKey(...args)
    const { ttl = 5 * 60 * 1000, storage = 'memory' } = options

    // Try to get from cache first
    const cache = storage === 'memory' 
      ? memoryCache.get(cacheKey)
      : (() => {
          try {
            const storageEngine = storage === 'localStorage' ? localStorage : sessionStorage
            const cached = storageEngine.getItem(cacheKey)
            return cached ? JSON.parse(cached) : null
          } catch {
            return null
          }
        })()

    if (cache && (!cache.ttl || Date.now() - cache.timestamp < cache.ttl)) {
      return cache.data
    }

    // Cache miss or expired, fetch new data
    try {
      const result = await fn(...args)
      const cacheItem = {
        data: result,
        timestamp: Date.now(),
        ttl
      }

      if (storage === 'memory') {
        memoryCache.set(cacheKey, cacheItem)
      } else {
        try {
          const storageEngine = storage === 'localStorage' ? localStorage : sessionStorage
          storageEngine.setItem(cacheKey, JSON.stringify(cacheItem))
        } catch (error) {
          console.warn('Storage cache failed, falling back to memory:', error)
          memoryCache.set(cacheKey, cacheItem)
        }
      }

      return result
    } catch (error) {
      // On error, return stale cache if available
      if (cache) {
        console.warn('API call failed, returning stale cache:', error)
        return cache.data
      }
      throw error
    }
  }
}