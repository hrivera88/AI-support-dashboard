export const API_ENDPOINTS = {
  AI: {
    GENERATE_RESPONSE: '/api/ai/generate-response',
    ANALYZE_SENTIMENT: '/api/ai/analyze-sentiment',
    EVALUATE_RESPONSE: '/api/ai/evaluate-response',
  },
  KNOWLEDGE: {
    SEARCH: '/api/knowledge/search',
    ARTICLES: '/api/knowledge/articles',
  },
  CONVERSATIONS: {
    LIST: '/api/conversations',
    GET: '/api/conversations/:id',
    CREATE: '/api/conversations',
    UPDATE: '/api/conversations/:id',
  },
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    SENTIMENT_TREND: '/api/analytics/sentiment-trend',
    QUALITY_TREND: '/api/analytics/quality-trend',
  },
} as const;

export const SENTIMENT_THRESHOLDS = {
  CRITICAL: -0.8,
  NEGATIVE: -0.3,
  NEUTRAL_LOW: -0.1,
  NEUTRAL_HIGH: 0.1,
  POSITIVE: 0.3,
} as const;

export const RESPONSE_TONES = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  EMPATHETIC: 'empathetic',
  TECHNICAL: 'technical',
} as const;

export const CONVERSATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const CONVERSATION_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const CUSTOMER_TIERS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const AI_MODELS = {
  GPT_4: 'gpt-4-turbo-preview',
  GPT_3_5: 'gpt-3.5-turbo',
} as const;

export const QUALITY_SCORE_THRESHOLDS = {
  EXCELLENT: 8.5,
  GOOD: 7.0,
  FAIR: 5.5,
  POOR: 4.0,
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_KEYS = {
  SENTIMENT_ANALYSIS: 'sentiment:',
  KNOWLEDGE_SEARCH: 'knowledge:',
  AI_RESPONSE: 'ai_response:',
  QUALITY_SCORE: 'quality:',
} as const;

export const RATE_LIMITS = {
  AI_REQUESTS_PER_MINUTE: 30,
  SEARCH_REQUESTS_PER_MINUTE: 60,
  GENERAL_REQUESTS_PER_MINUTE: 100,
} as const;