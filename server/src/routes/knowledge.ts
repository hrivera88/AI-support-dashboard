import { Router } from 'express'
import { KnowledgeService } from '../services/knowledge.js'
import { z } from 'zod'
import type { Request, Response } from 'express'

const router = Router()

// Lazy-load the knowledge service to ensure environment variables are loaded
let knowledgeService: KnowledgeService | null = null
const getKnowledgeService = () => {
  if (!knowledgeService) {
    knowledgeService = new KnowledgeService()
  }
  return knowledgeService
}

// Validation schemas
const searchRequestSchema = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(5),
  categories: z.array(z.string()).optional(),
  minRelevance: z.number().min(0).max(1).optional().default(0.7),
})

// POST /api/knowledge/search
router.post('/search', async (req: Request, res: Response) => {
  try {
    const validatedData = searchRequestSchema.parse(req.body)
    
    const articles = await getKnowledgeService().searchArticles(validatedData)
    
    res.json({
      success: true,
      data: articles,
      metadata: {
        requestId: `search_${Date.now()}`,
        query: validatedData.query,
        resultsCount: articles.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Knowledge search error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to search knowledge base',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/knowledge/articles
router.get('/articles', (req: Request, res: Response) => {
  try {
    const articles = getKnowledgeService().getAllArticles()
    
    res.json({
      success: true,
      data: articles,
      metadata: {
        totalCount: articles.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Get articles error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve articles',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/knowledge/articles/:id
router.get('/articles/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const article = getKnowledgeService().getArticleById(id)
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      })
    }
    
    res.json({
      success: true,
      data: article,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Get article error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve article',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/knowledge/categories
router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = getKnowledgeService().getCategories()
    
    res.json({
      success: true,
      data: categories,
      metadata: {
        count: categories.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Get categories error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/knowledge/categories/:category/articles
router.get('/categories/:category/articles', (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const articles = getKnowledgeService().getArticlesByCategory(decodeURIComponent(category))
    
    res.json({
      success: true,
      data: articles,
      metadata: {
        category,
        count: articles.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Get articles by category error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve articles by category',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/knowledge/health
router.get('/health', (req: Request, res: Response) => {
  try {
    const service = getKnowledgeService()
    const articles = service.getAllArticles()
    const categories = service.getCategories()

    res.json({
      success: true,
      service: 'Knowledge Base Service',
      status: 'operational',
      stats: {
        totalArticles: articles.length,
        categories: categories.length,
        categoryList: categories,
      },
      features: {
        semanticSearch: true,
        categoryFiltering: true,
        embeddings: true,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Knowledge health check error:', error)
    
    res.status(500).json({
      success: false,
      service: 'Knowledge Base Service',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router