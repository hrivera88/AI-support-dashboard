import { Router } from 'express'
import { OpenAIService } from '../services/openai.js'
import { z } from 'zod'
import type { Request, Response } from 'express'

const router = Router()

// Lazy-load the OpenAI service to ensure environment variables are loaded
let openAIService: OpenAIService | null = null
const getOpenAIService = () => {
  if (!openAIService) {
    openAIService = new OpenAIService()
  }
  return openAIService
}

// Validation schemas
const generateResponseSchema = z.object({
  conversationHistory: z.array(z.object({
    id: z.string(),
    content: z.string(),
    sender: z.enum(['customer', 'agent', 'ai']),
    timestamp: z.string().transform(str => new Date(str)),
    sentiment: z.any().optional(),
    metadata: z.record(z.any()).optional(),
  })),
  customerProfile: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    tier: z.enum(['basic', 'premium', 'enterprise']),
    previousInteractions: z.number(),
    averageSentiment: z.number(),
    preferredTone: z.enum(['professional', 'casual', 'empathetic', 'technical']),
  }),
  tone: z.enum(['professional', 'casual', 'empathetic', 'technical']),
  includeKnowledge: z.boolean(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
})

const analyzeSentimentSchema = z.object({
  message: z.string(),
  conversationContext: z.array(z.any()).optional(),
  customerId: z.string(),
})

const evaluateResponseSchema = z.object({
  response: z.string(),
  context: z.string(),
})

// POST /api/ai/generate-response
router.post('/generate-response', async (req: Request, res: Response) => {
  try {
    const validatedData = generateResponseSchema.parse(req.body)
    
    const responses = await getOpenAIService().generateResponse(validatedData)
    
    res.json({
      success: true,
      data: responses,
      metadata: {
        requestId: `req_${Date.now()}`,
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Generate response error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// POST /api/ai/analyze-sentiment
router.post('/analyze-sentiment', async (req: Request, res: Response) => {
  try {
    const { message, conversationContext } = analyzeSentimentSchema.parse(req.body)
    
    const contextString = conversationContext
      ?.map((msg: any) => `${msg.sender}: ${msg.content}`)
      .join('\n') || ''
    
    const sentiment = await getOpenAIService().analyzeSentiment(message, contextString)
    
    res.json({
      success: true,
      data: sentiment,
      metadata: {
        requestId: `sentiment_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiment',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// POST /api/ai/evaluate-response
router.post('/evaluate-response', async (req: Request, res: Response) => {
  try {
    const { response, context } = evaluateResponseSchema.parse(req.body)
    
    const qualityScore = await getOpenAIService().evaluateResponseQuality(response, context)
    
    res.json({
      success: true,
      data: qualityScore,
      metadata: {
        requestId: `quality_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Quality evaluation error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to evaluate response quality',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ai/health
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'AI Service',
    status: 'operational',
    features: {
      responseGeneration: true,
      sentimentAnalysis: true,
      qualityEvaluation: true,
    },
    timestamp: new Date().toISOString(),
  })
})

export default router