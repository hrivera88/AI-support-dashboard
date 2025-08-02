import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AIApiService } from '@/services/api'
import type { 
  AIResponseRequest, 
  AIResponseOption, 
  APIError 
} from '@/types/types'

export interface UseAIResponseOptions {
  onSuccess?: (responses: AIResponseOption[]) => void
  onError?: (error: APIError) => void
}

export function useAIResponse(options: UseAIResponseOptions = {}) {
  const [selectedResponse, setSelectedResponse] = useState<AIResponseOption | null>(null)
  const [responses, setResponses] = useState<AIResponseOption[]>([])

  const mutation = useMutation({
    mutationFn: (request: AIResponseRequest) => AIApiService.generateResponse(request),
    onSuccess: (data) => {
      setResponses(data)
      if (data.length > 0) {
        setSelectedResponse(data[0]) // Auto-select first response
      }
      options.onSuccess?.(data)
    },
    onError: (error: APIError) => {
      console.error('AI Response generation failed:', error)
      options.onError?.(error)
    },
  })

  const generateResponse = useCallback((request: AIResponseRequest) => {
    mutation.mutate(request)
  }, [mutation])

  const regenerateResponse = useCallback((request: AIResponseRequest) => {
    setSelectedResponse(null)
    setResponses([])
    mutation.mutate(request)
  }, [mutation])

  const selectResponse = useCallback((response: AIResponseOption) => {
    setSelectedResponse(response)
  }, [])

  const clearResponses = useCallback(() => {
    setResponses([])
    setSelectedResponse(null)
    mutation.reset()
  }, [mutation])

  return {
    // State
    responses,
    selectedResponse,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,

    // Actions
    generateResponse,
    regenerateResponse,
    selectResponse,
    clearResponses,

    // Utilities
    hasResponses: responses.length > 0,
    responseCount: responses.length,
  }
}