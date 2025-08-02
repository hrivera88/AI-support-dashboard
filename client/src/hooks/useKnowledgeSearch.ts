import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { KnowledgeApiService } from '@/services/knowledge'
import { useDebounce } from './useDebounce'
import type { 
  KnowledgeArticle, 
  KnowledgeSearchRequest, 
  APIError 
} from '@/types/types'

export interface UseKnowledgeSearchOptions {
  autoSearch?: boolean
  initialQuery?: string
  onSearchComplete?: (articles: KnowledgeArticle[]) => void
  onError?: (error: APIError) => void
}

export function useKnowledgeSearch(options: UseKnowledgeSearchOptions = {}) {
  const { autoSearch = false, initialQuery = '', onSearchComplete, onError } = options
  
  const [query, setQuery] = useState(initialQuery)
  const [searchFilters, setSearchFilters] = useState({
    categories: [] as string[],
    minRelevance: 0.7,
    limit: 10,
  })

  // Get all categories for filtering
  const categoriesQuery = useQuery({
    queryKey: ['knowledge-categories'],
    queryFn: () => KnowledgeApiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Manual search mutation
  const searchMutation = useMutation({
    mutationFn: (searchRequest: KnowledgeSearchRequest) =>
      KnowledgeApiService.searchArticles(searchRequest),
    onSuccess: (articles) => {
      onSearchComplete?.(articles)
    },
    onError: (error: APIError) => {
      console.error('Knowledge search failed:', error)
      onError?.(error)
    },
  })

  const search = useCallback((customQuery?: string, customFilters?: Partial<typeof searchFilters>) => {
    const searchQuery = customQuery || query
    const filters = { ...searchFilters, ...customFilters }
    
    if (!searchQuery.trim()) return
    
    const searchRequest: KnowledgeSearchRequest = {
      query: searchQuery,
      limit: filters.limit,
      categories: filters.categories.length > 0 ? filters.categories : undefined,
      minRelevance: filters.minRelevance,
    }
    
    searchMutation.mutate(searchRequest)
  }, [query, searchFilters, searchMutation])

  // Add debouncing for auto-search
  const debouncedQuery = useDebounce(query, 500)

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<typeof searchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery.trim() && debouncedQuery.length >= 2) {
      search(debouncedQuery)
    }
  }, [debouncedQuery, autoSearch, search])

  const clearSearch = useCallback(() => {
    setQuery('')
    searchMutation.reset()
  }, [searchMutation])

  return {
    // Search state
    query,
    searchFilters,
    results: searchMutation.data || [],
    
    // Loading states
    isSearching: searchMutation.isPending,
    isLoadingCategories: categoriesQuery.isLoading,
    
    // Error states
    searchError: searchMutation.error,
    categoriesError: categoriesQuery.error,
    
    // Success states
    hasResults: !!searchMutation.data && searchMutation.data.length > 0,
    resultsCount: searchMutation.data?.length || 0,
    
    // Available categories
    categories: categoriesQuery.data || [],
    
    // Actions
    search,
    updateQuery,
    updateFilters,
    clearSearch,
    refetchCategories: categoriesQuery.refetch,
    
    // Utilities
    hasSearched: searchMutation.isSuccess || searchMutation.isError,
    isIdle: searchMutation.isIdle,
  }
}

// Hook for getting all articles
export function useKnowledgeArticles() {
  return useQuery({
    queryKey: ['knowledge-articles'],
    queryFn: () => KnowledgeApiService.getAllArticles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting a specific article
export function useKnowledgeArticle(id: string) {
  return useQuery({
    queryKey: ['knowledge-article', id],
    queryFn: () => KnowledgeApiService.getArticleById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for getting articles by category
export function useKnowledgeArticlesByCategory(category: string) {
  return useQuery({
    queryKey: ['knowledge-articles-by-category', category],
    queryFn: () => KnowledgeApiService.getArticlesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}