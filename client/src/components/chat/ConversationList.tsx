import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Clock, User, Search } from 'lucide-react'
import { SentimentIndicator } from './SentimentIndicator'
import { useOptimizedFilter } from '@/hooks/useOptimizedSearch'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'
import { VirtualizedList } from '@/components/ui/LazyWrapper'
import type { ConversationContext, CustomerProfile } from '@/types/types'

interface ConversationListProps {
  conversations: ConversationContext[]
  selectedId?: string
  onSelect: (conversation: ConversationContext) => void
  customerProfiles: Record<string, CustomerProfile>
  className?: string
}

export function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect, 
  customerProfiles,
  className = '' 
}: ConversationListProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'high_priority'>('all')

  // Performance monitoring for this component
  usePerformanceMonitor('ConversationList', {
    sampleRate: 0.2,
    maxSamples: 50
  })

  // Optimized search with debouncing
  const searchFilter = useOptimizedFilter(
    conversations,
    (conv, query) => {
      const customer = customerProfiles[conv.customerId]
      const searchLower = query.toLowerCase()
      const matchesCustomer = customer?.name.toLowerCase().includes(searchLower) || customer?.email.toLowerCase().includes(searchLower)
      const matchesCategory = conv.category.toLowerCase().includes(searchLower)
      const matchesMessages = conv.messages.some(msg => msg.content.toLowerCase().includes(searchLower))
      
      return matchesCustomer || matchesCategory || matchesMessages
    },
    { debounceMs: 200, minSearchLength: 1 }
  )

  // Memoized utility functions for performance
  const formatRelativeTime = useCallback((date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }, [])

  // Apply status/priority filter first, then search filter
  const filteredConversations = useMemo(() => {
    let filtered = searchFilter.filteredItems

    // Apply status/priority filter
    if (filter === 'open') {
      filtered = filtered.filter(conv => conv.status === 'open')
    } else if (filter === 'in_progress') {
      filtered = filtered.filter(conv => conv.status === 'in_progress')
    } else if (filter === 'high_priority') {
      filtered = filtered.filter(conv => ['high', 'critical'].includes(conv.priority))
    }

    return filtered
  }, [searchFilter.filteredItems, filter])

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      // Sort by priority first (critical > high > medium > low)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff

      // Then by last update time
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
  }, [filteredConversations])

  // Memoized conversation item renderer for virtualization
  const renderConversationItem = useCallback((conversation: ConversationContext) => {
    const customer = customerProfiles[conversation.customerId]
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    const isSelected = conversation.id === selectedId
    const unreadCount = conversation.messages.filter(m => 
      m.sender === 'customer' && m.timestamp > new Date(Date.now() - 30 * 60 * 1000)
    ).length

    return (
      <div
        key={conversation.id}
        onClick={() => onSelect(conversation)}
        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
          isSelected ? 'bg-accent border-2 border-primary' : 'border border-transparent'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-sm truncate">
              {customer?.name || 'Unknown Customer'}
            </span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`} />
        </div>

        {/* Category and Status */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-muted-foreground truncate">
            {conversation.category}
          </span>
          <Badge variant="secondary" className={`text-xs px-2 py-0 ${getStatusColor(conversation.status)}`}>
            {conversation.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Last Message Preview */}
        <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {lastMessage?.content || 'No messages yet'}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(conversation.updatedAt)}
            </span>
          </div>

          {/* Sentiment for last customer message */}
          {lastMessage?.sender === 'customer' && lastMessage.sentiment && (
            <SentimentIndicator
              score={lastMessage.sentiment.score}
              trend="stable"
              compact={true}
            />
          )}
        </div>
      </div>
    )
  }, [customerProfiles, selectedId, onSelect, getPriorityColor, getStatusColor, formatRelativeTime])

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversations ({filteredConversations.length})
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchFilter.query}
            onChange={(e) => searchFilter.setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchFilter.isFiltering && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'open', label: 'Open' },
            { key: 'in_progress', label: 'Active' },
            { key: 'high_priority', label: 'Urgent' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as any)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-y-auto">
        <div className="p-3">
          {sortedConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : sortedConversations.length > 50 ? (
            // Use virtualization for large lists
            <VirtualizedList
              items={sortedConversations}
              itemHeight={120}
              containerHeight={400}
              renderItem={renderConversationItem}
            />
          ) : (
            // Regular rendering for smaller lists
            <div className="space-y-1">
              {sortedConversations.map((conversation) => 
                renderConversationItem(conversation)
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}