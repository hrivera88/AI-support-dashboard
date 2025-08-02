import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useDebounce } from './useDebounce'
import { useCache } from './useCache'

interface SearchOptions {
  debounceMs?: number
  minSearchLength?: number
  cacheResults?: boolean
  cacheTTL?: number
}


/**
 * Optimized search hook with debouncing, caching, and performance optimizations
 */
export function useOptimizedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  options: SearchOptions = {}
) {
  const {
    debounceMs = 300,
    minSearchLength = 2,
    cacheResults = true,
    cacheTTL = 5 * 60 * 1000 // 5 minutes
  } = options

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Track mounted state for cleanup
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const debouncedQuery = useDebounce(query, debounceMs)
  
  const cache = useCache<T[]>(`search-${debouncedQuery}`, {
    ttl: cacheTTL,
    storage: cacheResults ? 'sessionStorage' : 'memory'
  })

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minSearchLength) {
      if (isMountedRef.current) {
        setResults([])
        setHasSearched(false)
        setError(null)
      }
      return
    }

    if (isMountedRef.current) {
      setIsSearching(true)
      setError(null)
    }

    try {
      // Check cache first
      if (cacheResults) {
        const cachedResults = cache.getCache()
        if (cachedResults && !cache.isStale()) {
          if (isMountedRef.current) {
            setResults(cachedResults)
            setIsSearching(false)
            setHasSearched(true)
          }
          return
        }
      }

      // Perform actual search
      const searchResults = await searchFunction(searchQuery)
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      // Cache results
      if (cacheResults) {
        cache.setCache(searchResults)
      }

      setResults(searchResults)
      setHasSearched(true)
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      }
    } finally {
      if (isMountedRef.current) {
        setIsSearching(false)
      }
    }
  }, [searchFunction, minSearchLength, cacheResults, cache])

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== query) return // Only search when debounce is complete
    
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch, query])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    setError(null)
    if (cacheResults) {
      cache.clearCache()
    }
  }, [cache, cacheResults])

  const refreshSearch = useCallback(() => {
    if (cacheResults) {
      cache.clearCache()
    }
    performSearch(debouncedQuery)
  }, [cache, cacheResults, debouncedQuery, performSearch])

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasSearched,
    error,
    clearSearch,
    refreshSearch,
    totalCount: results.length,
    hasResults: results.length > 0,
    isEmpty: hasSearched && results.length === 0,
    canSearch: query.length >= minSearchLength
  }
}

/**
 * Hook for client-side filtering with performance optimizations
 */
export function useOptimizedFilter<T>(
  items: T[],
  filterFunction: (item: T, query: string) => boolean,
  options: Omit<SearchOptions, 'cacheResults'> = {}
) {
  const { debounceMs = 150, minSearchLength = 0 } = options
  
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceMs)

  const filteredItems = useMemo(() => {
    if (debouncedQuery.length < minSearchLength) {
      return items
    }

    return items.filter(item => filterFunction(item, debouncedQuery))
  }, [items, filterFunction, debouncedQuery, minSearchLength])

  const stats = useMemo(() => ({
    totalItems: items.length,
    filteredItems: filteredItems.length,
    isFiltering: query.length >= minSearchLength,
    filterRatio: items.length > 0 ? filteredItems.length / items.length : 0
  }), [items.length, filteredItems.length, query.length, minSearchLength])

  return {
    query,
    setQuery,
    filteredItems,
    stats,
    clearFilter: () => setQuery(''),
    hasFilter: query.length > 0,
    isFiltering: debouncedQuery !== query // Still processing
  }
}

/**
 * Hook for paginated search results
 */
export function usePaginatedSearch<T>(
  searchFunction: (query: string, page: number, limit: number) => Promise<{ items: T[], total: number }>,
  options: SearchOptions & { pageSize?: number } = {}
) {
  const { pageSize = 20, ...searchOptions } = options
  
  const [page, setPage] = useState(1)
  const [allResults, setAllResults] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)

  const searchWithPagination = useCallback(async (query: string) => {
    const result = await searchFunction(query, page, pageSize)
    return result.items
  }, [searchFunction, page, pageSize])

  const search = useOptimizedSearch(searchWithPagination, {
    ...searchOptions,
    cacheResults: false // Handle caching at this level for pagination
  })

  const resetPagination = useCallback(() => {
    setPage(1)
    setAllResults([])
    setTotalCount(0)
    setHasNextPage(false)
  }, [])

  // Reset pagination BEFORE search when query changes
  const previousQuery = useRef(search.query)
  useEffect(() => {
    if (search.query !== previousQuery.current) {
      resetPagination()
      previousQuery.current = search.query
    }
  }, [search.query, resetPagination])

  // Update pagination state when results change
  useEffect(() => {
    if (search.hasSearched && !search.isSearching) {
      if (page === 1) {
        setAllResults(search.results)
      } else {
        setAllResults(prev => [...prev, ...search.results])
      }
      
      setHasNextPage(search.results.length === pageSize)
    }
  }, [search.results, search.hasSearched, search.isSearching, page, pageSize])

  const loadMore = useCallback(() => {
    if (hasNextPage && !search.isSearching) {
      setPage(prev => prev + 1)
    }
  }, [hasNextPage, search.isSearching])

  return {
    ...search,
    results: allResults,
    page,
    hasNextPage,
    loadMore,
    resetPagination,
    totalCount,
    isLoadingMore: search.isSearching && page > 1
  }
}