export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent' | 'ai';
  timestamp: Date;
  sentiment?: SentimentData;
  metadata?: Record<string, any>;
}

export interface SentimentData {
  score: number; // -1 to 1
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
  emotions: {
    anger: number;
    joy: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  tier: 'basic' | 'premium' | 'enterprise';
  previousInteractions: number;
  averageSentiment: number;
  preferredTone: ResponseTone;
}

export interface ConversationContext {
  id: string;
  customerId: string;
  messages: Message[];
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ResponseTone = 'professional' | 'casual' | 'empathetic' | 'technical';

export interface AIResponseRequest {
  conversationHistory: Message[];
  customerProfile: CustomerProfile;
  tone: ResponseTone;
  includeKnowledge: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponseOption {
  id: string;
  content: string;
  tone: ResponseTone;
  confidence: number;
  qualityScore?: ResponseQualityScore;
}

export interface ResponseQualityScore {
  overall: number;
  clarity: number;
  completeness: number;
  tone: number;
  accuracy: number;
  actionability: number;
  suggestions: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore?: number;
  lastUpdated: Date;
  embedding?: number[];
}

export interface KnowledgeSearchRequest {
  query: string;
  limit?: number;
  categories?: string[];
  minRelevance?: number;
}

export interface AnalyticsData {
  totalConversations: number;
  averageResponseTime: number;
  sentimentTrend: Array<{ date: string; score: number }>;
  responseQualityTrend: Array<{ date: string; score: number }>;
  topCategories: Array<{ category: string; count: number }>;
  agentPerformance: Array<{ agentId: string; name: string; avgQuality: number; responseTime: number; conversationsHandled: number }>;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}