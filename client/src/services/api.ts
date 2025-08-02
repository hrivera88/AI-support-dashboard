import axios from 'axios'
import type {
  AIResponseRequest,
  AIResponseOption,
  SentimentData,
  ResponseQualityScore,
  APIError,
} from '@/types/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: APIError = {
      code: error.response?.status?.toString() || 'UNKNOWN',
      message: error.response?.data?.error || error.message || 'An error occurred',
      details: error.response?.data?.details || {},
    }
    return Promise.reject(apiError)
  }
)

export interface APIResponse<T> {
  success: boolean
  data: T
  metadata?: {
    requestId: string
    timestamp: string
    model?: string
  }
}

export class AIApiService {
  static async generateResponse(request: AIResponseRequest): Promise<AIResponseOption[]> {
    const response = await apiClient.post<APIResponse<AIResponseOption[]>>(
      '/ai/generate-response',
      request
    )
    return response.data.data
  }

  static async analyzeSentiment(
    message: string,
    conversationContext?: any[],
    customerId?: string
  ): Promise<SentimentData> {
    const response = await apiClient.post<APIResponse<SentimentData>>(
      '/ai/analyze-sentiment',
      {
        message,
        conversationContext,
        customerId: customerId || 'anonymous',
      }
    )
    return response.data.data
  }

  static async evaluateResponse(
    responseText: string,
    context: string
  ): Promise<ResponseQualityScore> {
    const response = await apiClient.post<APIResponse<ResponseQualityScore>>(
      '/ai/evaluate-response',
      {
        response: responseText,
        context,
      }
    )
    return response.data.data
  }

  static async healthCheck(): Promise<{ status: string; features: Record<string, boolean> }> {
    const response = await apiClient.get('/ai/health')
    return response.data
  }
}

export default AIApiService