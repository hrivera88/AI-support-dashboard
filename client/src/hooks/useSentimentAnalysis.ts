import { useCallback, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AIApiService } from '@/services/api'
import type { SentimentData, APIError } from '@/types/types'
import { SENTIMENT_THRESHOLDS } from '@/types/constants'

export interface UseSentimentAnalysisOptions {
  autoAnalyze?: boolean
  onSentimentChange?: (sentiment: SentimentData) => void
  onError?: (error: APIError) => void
}

export function useSentimentAnalysis(
  message?: string,
  conversationContext?: any[],
  options: UseSentimentAnalysisOptions = {}
) {
  const { autoAnalyze = false, onSentimentChange, onError } = options

  // Auto-analyze query (only runs if autoAnalyze is true and message exists)
  const autoQuery = useQuery({
    queryKey: ['sentiment', message, conversationContext?.length],
    queryFn: () => AIApiService.analyzeSentiment(message!, conversationContext),
    enabled: autoAnalyze && !!message && message.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Manual analyze mutation
  const mutation = useMutation({
    mutationFn: ({ 
      text, 
      context, 
      customerId 
    }: { 
      text: string
      context?: any[]
      customerId?: string 
    }) => AIApiService.analyzeSentiment(text, context, customerId),
    onSuccess: (data) => {
      onSentimentChange?.(data)
    },
    onError: (error: APIError) => {
      console.error('Sentiment analysis failed:', error)
      onError?.(error)
    },
  })

  const analyzeSentiment = useCallback((
    text: string,
    context?: any[],
    customerId?: string
  ) => {
    mutation.mutate({ text, context, customerId })
  }, [mutation])

  // Get the current sentiment data (from auto query or manual mutation)
  const sentimentData = autoQuery.data || mutation.data

  // Derived sentiment information
  const sentimentInfo = useMemo(() => {
    if (!sentimentData) return null

    const { score, label, confidence, emotions } = sentimentData

    // Determine priority based on sentiment
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (score <= SENTIMENT_THRESHOLDS.CRITICAL) priority = 'critical'
    else if (score <= SENTIMENT_THRESHOLDS.NEGATIVE) priority = 'high'
    else if (score <= SENTIMENT_THRESHOLDS.NEUTRAL_LOW) priority = 'medium'

    // Get color coding
    const getColor = () => {
      if (score <= SENTIMENT_THRESHOLDS.NEGATIVE) return 'red'
      if (score <= SENTIMENT_THRESHOLDS.NEUTRAL_HIGH) return 'yellow'
      return 'green'
    }

    // Get emoji representation
    const getEmoji = () => {
      if (emotions.anger > 0.6) return '😠'
      if (emotions.sadness > 0.6) return '😢'
      if (emotions.fear > 0.6) return '😰'
      if (emotions.joy > 0.6) return '😊'
      if (emotions.surprise > 0.6) return '😲'
      if (score <= SENTIMENT_THRESHOLDS.NEGATIVE) return '😔'
      if (score >= SENTIMENT_THRESHOLDS.POSITIVE) return '😊'
      return '😐'
    }

    // Get trend (simplified - would need historical data for real trend)
    const getTrend = (): 'improving' | 'declining' | 'stable' => {
      // This is a simplified implementation
      // In a real app, you'd compare with previous sentiment scores
      if (confidence < 0.5) return 'stable'
      return score > 0 ? 'improving' : score < -0.3 ? 'declining' : 'stable'
    }

    return {
      ...sentimentData,
      priority,
      color: getColor(),
      emoji: getEmoji(),
      trend: getTrend(),
      isPositive: score > SENTIMENT_THRESHOLDS.POSITIVE,
      isNegative: score < SENTIMENT_THRESHOLDS.NEGATIVE,
      isCritical: score <= SENTIMENT_THRESHOLDS.CRITICAL,
      needsAttention: score <= SENTIMENT_THRESHOLDS.NEGATIVE,
    }
  }, [sentimentData])

  return {
    // Raw data
    sentimentData,
    sentimentInfo,

    // Loading states
    isLoading: autoQuery.isLoading || mutation.isPending,
    isError: autoQuery.isError || mutation.isError,
    error: autoQuery.error || mutation.error,

    // Success states
    isSuccess: autoQuery.isSuccess || mutation.isSuccess,
    hasData: !!sentimentData,

    // Actions
    analyzeSentiment,
    refetch: autoQuery.refetch,
    reset: mutation.reset,

    // Utilities
    isAnalyzing: autoQuery.isFetching || mutation.isPending,
  }
}

// Hook for analyzing multiple messages
export function useBatchSentimentAnalysis() {
  const mutation = useMutation({
    mutationFn: async (messages: Array<{ id: string; text: string; context?: any[] }>) => {
      const results = await Promise.all(
        messages.map(async ({ id, text, context }) => ({
          id,
          sentiment: await AIApiService.analyzeSentiment(text, context),
        }))
      )
      return results
    },
  })

  const analyzeBatch = useCallback((
    messages: Array<{ id: string; text: string; context?: any[] }>
  ) => {
    mutation.mutate(messages)
  }, [mutation])

  return {
    results: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    analyzeBatch,
    reset: mutation.reset,
  }
}