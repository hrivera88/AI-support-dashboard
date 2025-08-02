import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useKnowledgeSearch } from '@/hooks/useKnowledgeSearch'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'
import { useCache } from '@/hooks/useCache'
import { Search, Filter, Book, Clock, Tag, Loader2 } from 'lucide-react'
import type { KnowledgeArticle } from '@/types/types'

interface KnowledgeSearchProps {
  onSelectArticle?: (article: KnowledgeArticle) => void
  contextQuery?: string
  autoSearch?: boolean
}

export function KnowledgeSearch({ onSelectArticle, contextQuery, autoSearch = false }: KnowledgeSearchProps) {
  const [localQuery, setLocalQuery] = useState(contextQuery || '')
  const [showFilters, setShowFilters] = useState(false)

  // Performance monitoring
  usePerformanceMonitor('KnowledgeSearch', {
    sampleRate: 0.1,
    trackMemory: true
  })

  // Cache for formatted dates to avoid recalculation
  const dateCache = useCache<Record<string, string>>('knowledge-date-cache', {
    ttl: 30 * 60 * 1000, // 30 minutes
    storage: 'memory'
  })

  const knowledge = useKnowledgeSearch({
    autoSearch,
    initialQuery: contextQuery || '',
    onSearchComplete: (articles) => {
      console.log(`Found ${articles.length} relevant articles`)
    },
  })

  // Update local query when contextQuery changes
  useEffect(() => {
    if (contextQuery && contextQuery !== localQuery) {
      setLocalQuery(contextQuery)
      knowledge.updateQuery(contextQuery)
    }
  }, [contextQuery, localQuery, knowledge])

  const handleSearch = () => {
    knowledge.search(localQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = knowledge.searchFilters.categories
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    knowledge.updateFilters({ categories: newCategories })
  }

  // Memoized date formatter with caching
  const formatDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    
    return (date: Date) => {
      const dateKey = date.toISOString()
      const cachedDates = dateCache.getCache() || {}
      
      if (cachedDates[dateKey] && !dateCache.isStale()) {
        return cachedDates[dateKey]
      }
      
      const formatted = formatter.format(new Date(date))
      const newCache = { ...cachedDates, [dateKey]: formatted }
      dateCache.setCache(newCache)
      
      return formatted
    }
  }, [dateCache])

  // Memoize search results to prevent unnecessary re-renders
  const memoizedResults = useMemo(() => knowledge.results, [knowledge.results])

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Knowledge Base Search
          </CardTitle>
          <CardDescription>
            Search through our comprehensive knowledge base using AI-powered semantic search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value)
                  if (autoSearch) {
                    knowledge.updateQuery(e.target.value)
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Search for help articles, policies, or procedures..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {!autoSearch && (
              <Button 
                onClick={handleSearch}
                disabled={knowledge.isSearching || !localQuery.trim()}
              >
                {knowledge.isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border rounded-md p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {knowledge.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        knowledge.searchFilters.categories.includes(category)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Relevance Threshold</h4>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={knowledge.searchFilters.minRelevance}
                  onChange={(e) => knowledge.updateFilters({ minRelevance: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Less Strict</span>
                  <span>{(knowledge.searchFilters.minRelevance * 100).toFixed(0)}%</span>
                  <span>More Strict</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Status */}
          {knowledge.isSearching && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching knowledge base...
            </div>
          )}

          {knowledge.hasSearched && !knowledge.isSearching && (
            <div className="text-sm text-muted-foreground">
              {knowledge.hasResults 
                ? `Found ${knowledge.resultsCount} relevant articles`
                : 'No articles found. Try adjusting your search terms or filters.'
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {knowledge.hasResults && (
        <div className="space-y-4">
          {memoizedResults.map((article) => (
            <Card 
              key={article.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectArticle?.(article)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  {article.relevanceScore && (
                    <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {(article.relevanceScore * 100).toFixed(0)}% match
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-3 line-clamp-3">
                  {article.content}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {article.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {formatDate(article.lastUpdated)}
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span>Tags:</span>
                      <span>{article.tags.slice(0, 3).join(', ')}</span>
                      {article.tags.length > 3 && <span>+{article.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {knowledge.searchError && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-red-600">
              <h3 className="font-medium mb-1">Search Error</h3>
              <p className="text-sm">{knowledge.searchError.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}