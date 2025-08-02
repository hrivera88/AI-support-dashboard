import OpenAI from 'openai'
import type { 
  KnowledgeArticle, 
  KnowledgeSearchRequest 
} from '../types/shared.js'

export class KnowledgeService {
  private client: OpenAI
  private articles: KnowledgeArticle[] = []

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Initialize with sample articles
    this.initializeSampleData()
  }

  private initializeSampleData() {
    this.articles = [
      {
        id: 'article-1',
        title: 'How to Process Returns and Refunds',
        content: 'To process a return or refund, first verify the order details in our system. Check the return policy timeframe (30 days for most items). For eligible returns, generate a return shipping label and provide the customer with tracking information. Once we receive the item, inspect it for damage and process the refund within 3-5 business days.',
        category: 'Returns & Refunds',
        tags: ['returns', 'refunds', 'policy', 'shipping'],
        lastUpdated: new Date('2024-01-15'),
        embedding: [], // Will be populated when needed
      },
      {
        id: 'article-2',
        title: 'Handling Shipping Delays and Issues',
        content: 'When customers report shipping delays, first check the tracking information in our carrier system. Common causes include weather delays, incorrect addresses, or carrier issues. Apologize for the inconvenience and provide updated tracking information. For delays over 7 days, offer expedited shipping on the replacement order or a partial refund.',
        category: 'Shipping',
        tags: ['shipping', 'delays', 'tracking', 'carrier'],
        lastUpdated: new Date('2024-01-10'),
        embedding: [],
      },
      {
        id: 'article-3',
        title: 'Account and Password Reset Procedures',
        content: 'To help customers reset their passwords, guide them to the "Forgot Password" link on the login page. They will receive an email with a reset link valid for 24 hours. If they do not receive the email, check if it went to spam or verify the email address on file. For account lockouts, verify the customer identity and manually unlock the account in the admin panel.',
        category: 'Account Support',
        tags: ['password', 'account', 'reset', 'login', 'email'],
        lastUpdated: new Date('2024-01-12'),
        embedding: [],
      },
      {
        id: 'article-4',
        title: 'Product Warranty and Technical Support',
        content: 'Our products come with a 1-year manufacturer warranty covering defects and malfunctions. For warranty claims, collect the order number, product serial number, and description of the issue. For technical issues, first walk through basic troubleshooting steps. If the issue persists, escalate to our technical team or offer a warranty replacement.',
        category: 'Technical Support',
        tags: ['warranty', 'technical', 'troubleshooting', 'replacement'],
        lastUpdated: new Date('2024-01-08'),
        embedding: [],
      },
      {
        id: 'article-5',
        title: 'Billing and Payment Issues',
        content: 'For billing disputes, first review the transaction details and verify the charge amount. Common issues include duplicate charges, incorrect amounts, or unrecognized transactions. For payment failures, check if the payment method is valid and has sufficient funds. Offer alternative payment methods and update the customer on any pending charges.',
        category: 'Billing',
        tags: ['billing', 'payment', 'disputes', 'charges', 'credit card'],
        lastUpdated: new Date('2024-01-14'),
        embedding: [],
      },
    ]
  }

  async searchArticles(request: KnowledgeSearchRequest): Promise<KnowledgeArticle[]> {
    try {
      const { query, limit = 5, categories, minRelevance = 0.7 } = request

      // Generate embedding for the search query
      const queryEmbedding = await this.generateEmbedding(query)

      // Ensure all articles have embeddings
      await this.ensureArticleEmbeddings()

      // Calculate similarity scores
      const articlesWithScores = this.articles
        .map(article => ({
          ...article,
          relevanceScore: this.calculateCosineSimilarity(queryEmbedding, article.embedding!),
        }))
        .filter(article => {
          // Filter by relevance threshold
          if (article.relevanceScore! < minRelevance) return false
          
          // Filter by categories if specified
          if (categories && categories.length > 0) {
            return categories.includes(article.category)
          }
          
          return true
        })
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, limit)

      return articlesWithScores
    } catch (error) {
      console.error('Knowledge search error:', error)
      return []
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      })

      return response.data[0].embedding
    } catch (error) {
      console.error('Embedding generation error:', error)
      return []
    }
  }

  private async ensureArticleEmbeddings() {
    for (const article of this.articles) {
      if (!article.embedding || article.embedding.length === 0) {
        // Combine title and content for embedding
        const textForEmbedding = `${article.title}\n\n${article.content}`
        article.embedding = await this.generateEmbedding(textForEmbedding)
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i]
      normA += vectorA[i] * vectorA[i]
      normB += vectorB[i] * vectorB[i]
    }

    if (normA === 0 || normB === 0) return 0

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  getAllArticles(): KnowledgeArticle[] {
    return this.articles.map(article => ({
      ...article,
      embedding: undefined, // Don't send embeddings to client
    }))
  }

  getArticleById(id: string): KnowledgeArticle | undefined {
    const article = this.articles.find(a => a.id === id)
    if (article) {
      return {
        ...article,
        embedding: undefined, // Don't send embeddings to client
      }
    }
    return undefined
  }

  getCategories(): string[] {
    return [...new Set(this.articles.map(article => article.category))]
  }

  getArticlesByCategory(category: string): KnowledgeArticle[] {
    return this.articles
      .filter(article => article.category === category)
      .map(article => ({
        ...article,
        embedding: undefined,
      }))
  }

  // Method to add new articles (for future use)
  async addArticle(article: Omit<KnowledgeArticle, 'id' | 'embedding' | 'lastUpdated'>): Promise<KnowledgeArticle> {
    const newArticle: KnowledgeArticle = {
      ...article,
      id: `article-${Date.now()}`,
      lastUpdated: new Date(),
      embedding: await this.generateEmbedding(`${article.title}\n\n${article.content}`),
    }

    this.articles.push(newArticle)
    
    return {
      ...newArticle,
      embedding: undefined,
    }
  }
}