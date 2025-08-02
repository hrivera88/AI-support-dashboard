import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAIResponse } from '@/hooks/useAIResponse'
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis'
import { useResponseQuality } from '@/hooks/useResponseQuality'
import { Loader2, Bot, Heart, Star } from 'lucide-react'
import type { CustomerProfile, Message, ResponseTone } from '@/types/types'

export function AIDemo() {
  const [testMessage, setTestMessage] = useState("I'm really frustrated with this service. My order is 3 days late and no one has contacted me!")
  const [tone, setTone] = useState<ResponseTone>('empathetic')

  // Sample customer profile
  const customerProfile: CustomerProfile = {
    id: 'demo-customer',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    tier: 'premium',
    previousInteractions: 5,
    averageSentiment: -0.2,
    preferredTone: 'professional',
  }

  // Sample conversation history
  const conversationHistory: Message[] = [
    {
      id: '1',
      content: "Hi, I need help with my order #12345",
      sender: 'customer',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: '2',
      content: "I can help you with that. Let me look up your order.",
      sender: 'agent',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
    },
    {
      id: '3',
      content: testMessage,
      sender: 'customer',
      timestamp: new Date(),
    },
  ]

  // Hooks
  const aiResponse = useAIResponse({
    onSuccess: (responses) => {
      console.log('Generated responses:', responses)
    },
  })

  const sentiment = useSentimentAnalysis(testMessage, conversationHistory, {
    autoAnalyze: true,
    onSentimentChange: (data) => {
      console.log('Sentiment updated:', data)
    },
  })

  const quality = useResponseQuality()

  const handleGenerateResponse = () => {
    aiResponse.generateResponse({
      conversationHistory,
      customerProfile,
      tone,
      includeKnowledge: true,
      maxTokens: 300,
      temperature: 0.7,
    })
  }

  const handleEvaluateResponse = () => {
    if (aiResponse.selectedResponse) {
      quality.evaluateResponse(
        aiResponse.selectedResponse.content,
        `Customer: ${testMessage}\nContext: Premium customer, 5 previous interactions`
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Features Demo</h2>
        <p className="text-muted-foreground">
          Test the AI-powered response generation, sentiment analysis, and quality scoring
        </p>
      </div>

      {/* Customer Message Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Customer Message & Sentiment
          </CardTitle>
          <CardDescription>
            Modify the customer message to see real-time sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            placeholder="Enter a customer message..."
          />
          
          {sentiment.sentimentInfo && (
            <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
              <div className="text-2xl">{sentiment.sentimentInfo.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Sentiment:</span>
                  <span className={`px-2 py-1 rounded text-sm text-white ${
                    sentiment.sentimentInfo.color === 'red' ? 'bg-red-500' :
                    sentiment.sentimentInfo.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {sentiment.sentimentInfo.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Score: {sentiment.sentimentInfo.score.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Priority: {sentiment.sentimentInfo.priority} • 
                  Confidence: {(sentiment.sentimentInfo.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {sentiment.isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing sentiment...
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Response Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Response Generation
          </CardTitle>
          <CardDescription>
            Generate contextual responses with different tones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ResponseTone)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="empathetic">Empathetic</option>
              <option value="technical">Technical</option>
            </select>
            <Button 
              onClick={handleGenerateResponse}
              disabled={aiResponse.isLoading}
            >
              {aiResponse.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Response'
              )}
            </Button>
          </div>

          {aiResponse.responses.map((response, index) => (
            <div
              key={response.id}
              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                aiResponse.selectedResponse?.id === response.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted'
              }`}
              onClick={() => aiResponse.selectResponse(response)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Option {index + 1}</span>
                <span className="text-xs text-muted-foreground">
                  Confidence: {(response.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm">{response.content}</p>
            </div>
          ))}

          {aiResponse.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              Error: {aiResponse.error?.message || 'Failed to generate response'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Evaluation */}
      {aiResponse.selectedResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Response Quality Evaluation
            </CardTitle>
            <CardDescription>
              AI-powered quality assessment of the selected response
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleEvaluateResponse}
              disabled={quality.isLoading}
            >
              {quality.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                'Evaluate Quality'
              )}
            </Button>

            {quality.qualityScore && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quality.qualityScore.overall.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{quality.qualityScore.clarity.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Clarity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{quality.qualityScore.completeness.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Completeness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{quality.qualityScore.tone.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Tone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{quality.qualityScore.accuracy.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{quality.qualityScore.actionability.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Actionability</div>
                  </div>
                </div>

                {quality.qualityScore.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Suggestions for Improvement:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {quality.qualityScore.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}