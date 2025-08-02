import OpenAI from 'openai'
import type { 
  AIResponseRequest, 
  AIResponseOption, 
  ResponseTone, 
  SentimentData,
  ResponseQualityScore 
} from '../types/shared.js'

export class OpenAIService {
  private client: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateResponse(request: AIResponseRequest): Promise<AIResponseOption[]> {
    try {
      const prompt = this.buildResponsePrompt(request)
      
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 500,
        n: 3, // Generate 3 response options
      })

      return completion.choices.map((choice, index) => ({
        id: `response_${Date.now()}_${index}`,
        content: choice.message?.content || '',
        tone: request.tone,
        confidence: this.calculateConfidence(choice),
      }))
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  async analyzeSentiment(message: string, context?: string): Promise<SentimentData> {
    try {
      const prompt = `Analyze the sentiment of this customer message. Respond with ONLY a valid JSON object, no markdown formatting or code blocks.

Required JSON structure:
{
  "score": -1 to 1 (negative to positive),
  "label": "positive" | "neutral" | "negative",
  "confidence": 0 to 1,
  "emotions": {
    "anger": 0 to 1,
    "joy": 0 to 1,
    "fear": 0 to 1,
    "sadness": 0 to 1,
    "surprise": 0 to 1
  }
}

${context ? `Context: ${context}` : ''}
Message: "${message}"`

      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No sentiment analysis response')

      // Clean the response - remove markdown code blocks if present
      const cleanedResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      return JSON.parse(cleanedResponse) as SentimentData
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      // Return neutral sentiment as fallback
      return {
        score: 0,
        label: 'neutral',
        confidence: 0.5,
        emotions: {
          anger: 0,
          joy: 0,
          fear: 0,
          sadness: 0,
          surprise: 0,
        },
      }
    }
  }

  async evaluateResponseQuality(
    response: string,
    context: string
  ): Promise<ResponseQualityScore> {
    try {
      const prompt = `Evaluate this customer support response on the following criteria (1-10 scale). Respond with ONLY a valid JSON object, no markdown formatting or code blocks.

Required JSON structure:
{
  "overall": average of all scores,
  "clarity": 1-10,
  "completeness": 1-10,
  "tone": 1-10,
  "accuracy": 1-10,
  "actionability": 1-10,
  "suggestions": ["suggestion1", "suggestion2"]
}

Context: ${context}
Response: "${response}"`

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 300,
      })

      const result = completion.choices[0]?.message?.content
      if (!result) throw new Error('No quality evaluation response')

      // Clean the response - remove markdown code blocks if present
      const cleanedResult = result
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      return JSON.parse(cleanedResult) as ResponseQualityScore
    } catch (error) {
      console.error('Quality evaluation error:', error)
      // Return default scores as fallback
      return {
        overall: 7,
        clarity: 7,
        completeness: 7,
        tone: 7,
        accuracy: 7,
        actionability: 7,
        suggestions: ['Unable to evaluate response quality'],
      }
    }
  }

  private buildResponsePrompt(request: AIResponseRequest): string {
    const { conversationHistory, customerProfile, tone, includeKnowledge } = request
    
    const recentMessages = conversationHistory.slice(-5) // Last 5 messages for context
    const messagesContext = recentMessages
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n')

    const toneInstructions = this.getToneInstructions(tone)

    return `You are an AI assistant helping a customer support agent craft responses.

Customer Profile:
- Name: ${customerProfile.name}
- Tier: ${customerProfile.tier}
- Previous interactions: ${customerProfile.previousInteractions}
- Preferred tone: ${customerProfile.preferredTone}

Recent Conversation:
${messagesContext}

Instructions:
${toneInstructions}

Task: Generate a ${tone} response that:
1. Acknowledges the customer's concern
2. Provides a helpful solution
3. Maintains appropriate tone for ${customerProfile.tier} tier customer
4. Includes clear next steps

${includeKnowledge ? 'Include relevant knowledge base information if applicable.' : ''}

Response:`
  }

  private getToneInstructions(tone: ResponseTone): string {
    const instructions = {
      professional: 'Use formal language, be respectful and authoritative. Avoid casual expressions.',
      casual: 'Use friendly, conversational language. Be approachable and relatable.',
      empathetic: 'Show understanding and compassion. Acknowledge emotions and provide reassurance.',
      technical: 'Use precise, detailed explanations. Include technical terms when appropriate.',
    }

    return instructions[tone] || instructions.professional
  }

  private calculateConfidence(choice: any): number {
    // Simple confidence calculation based on finish_reason and length
    if (choice.finish_reason === 'stop' && choice.message?.content) {
      const contentLength = choice.message.content.length
      return Math.min(0.9, 0.5 + (contentLength / 1000) * 0.4)
    }
    return 0.5
  }
}