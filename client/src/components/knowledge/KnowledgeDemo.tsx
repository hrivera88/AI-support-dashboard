import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KnowledgeSearch } from './KnowledgeSearch'
import { ArticleViewer } from './ArticleViewer'
import { useKnowledgeArticles } from '@/hooks/useKnowledgeSearch'
import { BookOpen, Search, TrendingUp, Users } from 'lucide-react'
import type { KnowledgeArticle } from '@/types/types'

type ViewMode = 'search' | 'article' | 'browse'

export function KnowledgeDemo() {
  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)
  const [contextQuery, setContextQuery] = useState('')

  const { data: allArticles, isLoading: isLoadingArticles } = useKnowledgeArticles()

  const handleSelectArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article)
    setViewMode('article')
  }

  const handleBackToSearch = () => {
    setSelectedArticle(null)
    setViewMode('search')
  }

  const handleContextSearch = (query: string) => {
    setContextQuery(query)
    setViewMode('search')
  }

  const sampleQueries = [
    "How do I process a refund?",
    "Customer password reset procedure",
    "Shipping delay compensation",
    "Product warranty claim process",
    "Billing dispute resolution"
  ]

  const getCategoryStats = () => {
    if (!allArticles) return {}
    
    const stats: Record<string, number> = {}
    allArticles.forEach(article => {
      stats[article.category] = (stats[article.category] || 0) + 1
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  if (viewMode === 'article' && selectedArticle) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Knowledge Base Article</h2>
          <p className="text-muted-foreground">
            Detailed article view with semantic search relevance
          </p>
        </div>
        
        <ArticleViewer
          article={selectedArticle}
          onBack={handleBackToSearch}
          onCopyContent={(content) => {
            console.log('Article content copied:', content.slice(0, 100) + '...')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI-Powered Knowledge Base</h2>
        <p className="text-muted-foreground">
          Semantic search through support articles using OpenAI embeddings
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === 'search' ? 'default' : 'outline'}
          onClick={() => setViewMode('search')}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button
          variant={viewMode === 'browse' ? 'default' : 'outline'}
          onClick={() => setViewMode('browse')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Browse All
        </Button>
      </div>

      {viewMode === 'search' && (
        <div className="space-y-6">
          {/* Quick Start Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Try These Sample Searches
              </CardTitle>
              <CardDescription>
                Click any query below to see semantic search in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {sampleQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => handleContextSearch(query)}
                  >
                    <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{query}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Knowledge Base Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {allArticles?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Object.keys(categoryStats).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-sm text-muted-foreground">Semantic Search</div>
                </div>
              </div>
              
              {Object.keys(categoryStats).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Articles by Category</h4>
                  <div className="space-y-2">
                    {Object.entries(categoryStats).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Component */}
          <KnowledgeSearch
            onSelectArticle={handleSelectArticle}
            contextQuery={contextQuery}
            autoSearch={false}
          />
        </div>
      )}

      {viewMode === 'browse' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Knowledge Base Articles</CardTitle>
              <CardDescription>
                Browse through all available support articles organized by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading articles...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-2">{category} ({count})</h3>
                      <div className="grid gap-2 ml-4">
                        {allArticles
                          ?.filter(article => article.category === category)
                          .map(article => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              className="justify-start text-left h-auto p-3"
                              onClick={() => handleSelectArticle(article)}
                            >
                              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{article.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {article.content}
                                </div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}