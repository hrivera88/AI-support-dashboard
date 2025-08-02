import axios from 'axios'
import type {
  KnowledgeArticle,
  KnowledgeSearchRequest,
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
    requestId?: string
    query?: string
    resultsCount?: number
    totalCount?: number
    category?: string
    count?: number
    timestamp: string
  }
}

export class KnowledgeApiService {
  static async searchArticles(searchRequest: KnowledgeSearchRequest): Promise<KnowledgeArticle[]> {
    const response = await apiClient.post<APIResponse<KnowledgeArticle[]>>(
      '/knowledge/search',
      searchRequest
    )
    return response.data.data
  }

  static async getAllArticles(): Promise<KnowledgeArticle[]> {
    const response = await apiClient.get<APIResponse<KnowledgeArticle[]>>(
      '/knowledge/articles'
    )
    return response.data.data
  }

  static async getArticleById(id: string): Promise<KnowledgeArticle> {
    const response = await apiClient.get<APIResponse<KnowledgeArticle>>(
      `/knowledge/articles/${id}`
    )
    return response.data.data
  }

  static async getCategories(): Promise<string[]> {
    const response = await apiClient.get<APIResponse<string[]>>(
      '/knowledge/categories'
    )
    return response.data.data
  }

  static async getArticlesByCategory(category: string): Promise<KnowledgeArticle[]> {
    const response = await apiClient.get<APIResponse<KnowledgeArticle[]>>(
      `/knowledge/categories/${encodeURIComponent(category)}/articles`
    )
    return response.data.data
  }

  static async healthCheck(): Promise<{ 
    status: string
    stats: {
      totalArticles: number
      categories: number
      categoryList: string[]
    }
    features: Record<string, boolean> 
  }> {
    const response = await apiClient.get('/knowledge/health')
    return response.data
  }
}

export default KnowledgeApiService