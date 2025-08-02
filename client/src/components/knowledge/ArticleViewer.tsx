import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Book, Clock, Tag, Copy, ArrowLeft } from 'lucide-react'
import type { KnowledgeArticle } from '@/types/types'

interface ArticleViewerProps {
  article: KnowledgeArticle
  onBack?: () => void
  onCopyContent?: (content: string) => void
  showBackButton?: boolean
}

export function ArticleViewer({ 
  article, 
  onBack, 
  onCopyContent, 
  showBackButton = true 
}: ArticleViewerProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const handleCopyContent = () => {
    const formattedContent = `${article.title}\n\n${article.content}`
    
    navigator.clipboard.writeText(formattedContent).then(() => {
      onCopyContent?.(formattedContent)
      // You could add a toast notification here
      console.log('Article content copied to clipboard')
    }).catch((err) => {
      console.error('Failed to copy content:', err)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {showBackButton && onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopyContent}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Content
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Book className="h-6 w-6 text-primary mt-1" />
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span className="font-medium">{article.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last updated {formatDate(article.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {article.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relevance Score (if available) */}
      {article.relevanceScore && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Relevance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(article.relevanceScore * 100)}%` }}
                  />
                </div>
              </div>
              <span className="font-medium">
                {(article.relevanceScore * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This article is a {(article.relevanceScore * 100).toFixed(1)}% match for your search query.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}