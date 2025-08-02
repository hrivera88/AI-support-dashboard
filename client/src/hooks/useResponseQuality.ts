import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AIApiService } from '@/services/api'
import type { ResponseQualityScore, APIError } from '@/types/types'
import { QUALITY_SCORE_THRESHOLDS } from '@/types/constants'

export interface UseResponseQualityOptions {
  onQualityEvaluated?: (score: ResponseQualityScore) => void
  onError?: (error: APIError) => void
}

export function useResponseQuality(options: UseResponseQualityOptions = {}) {
  const { onQualityEvaluated, onError } = options

  const mutation = useMutation({
    mutationFn: ({ response, context }: { response: string; context: string }) =>
      AIApiService.evaluateResponse(response, context),
    onSuccess: (data) => {
      onQualityEvaluated?.(data)
    },
    onError: (error: APIError) => {
      console.error('Response quality evaluation failed:', error)
      onError?.(error)
    },
  })

  const evaluateResponse = useCallback((response: string, context: string) => {
    mutation.mutate({ response, context })
  }, [mutation])

  // Quality assessment helpers
  const getQualityLevel = (score: number) => {
    if (score >= QUALITY_SCORE_THRESHOLDS.EXCELLENT) return 'excellent'
    if (score >= QUALITY_SCORE_THRESHOLDS.GOOD) return 'good'
    if (score >= QUALITY_SCORE_THRESHOLDS.FAIR) return 'fair'
    return 'poor'
  }

  const getQualityColor = (score: number) => {
    if (score >= QUALITY_SCORE_THRESHOLDS.EXCELLENT) return 'green'
    if (score >= QUALITY_SCORE_THRESHOLDS.GOOD) return 'blue'
    if (score >= QUALITY_SCORE_THRESHOLDS.FAIR) return 'yellow'
    return 'red'
  }

  const qualityScore = mutation.data
  const qualityLevel = qualityScore ? getQualityLevel(qualityScore.overall) : null
  const qualityColor = qualityScore ? getQualityColor(qualityScore.overall) : null

  return {
    // Data
    qualityScore,
    qualityLevel,
    qualityColor,

    // Loading states
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,

    // Actions
    evaluateResponse,
    reset: mutation.reset,

    // Utilities
    hasScore: !!qualityScore,
    isExcellent: qualityScore && qualityScore.overall >= QUALITY_SCORE_THRESHOLDS.EXCELLENT,
    isGood: qualityScore && qualityScore.overall >= QUALITY_SCORE_THRESHOLDS.GOOD,
    needsImprovement: qualityScore && qualityScore.overall < QUALITY_SCORE_THRESHOLDS.FAIR,
  }
}