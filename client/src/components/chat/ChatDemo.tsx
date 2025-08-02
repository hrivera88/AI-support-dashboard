import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatInterface } from './ChatInterface'
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react'
import type { SentimentData } from '@/types/types'

export function ChatDemo() {
  const [currentSentiment, setCurrentSentiment] = useState<SentimentData | null>(null)

  const handleSentimentChange = (sentiment: SentimentData) => {
    setCurrentSentiment(sentiment)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Customer Support Chat Interface</h2>
        <p className="text-muted-foreground">
          Intelligent chat interface with AI-powered response suggestions and real-time sentiment analysis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Active Conversations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Customers Helped Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Response Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">2.3m</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Sentiment Display */}
      {currentSentiment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Customer Sentiment</CardTitle>
            <CardDescription>
              Real-time analysis of the customer's emotional state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg ${
                currentSentiment.score >= 0.2 ? 'bg-green-100 text-green-800' :
                currentSentiment.score <= -0.2 ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                <div className="font-medium capitalize">{currentSentiment.label}</div>
                <div className="text-sm">Score: {(currentSentiment.score * 100).toFixed(0)}%</div>
              </div>
              
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Confidence: {(currentSentiment.confidence * 100).toFixed(0)}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentSentiment.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">📱 Chat Interface</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real-time conversation management</li>
                <li>• Priority-based conversation sorting</li>
                <li>• Customer profile integration</li>
                <li>• Message history with timestamps</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🤖 AI Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Smart response generation</li>
                <li>• Multiple tone options</li>
                <li>• Response quality analysis</li>
                <li>• Quick action templates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">😊 Sentiment Analysis</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real-time emotion detection</li>
                <li>• Confidence scoring</li>
                <li>• Emotional breakdown</li>
                <li>• Trend indicators</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🎯 Smart Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Conversation filtering</li>
                <li>• Search functionality</li>
                <li>• Priority management</li>
                <li>• Status tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <div className="h-[600px]">
        <ChatInterface 
          onSentimentChange={handleSentimentChange}
          className="h-full"
        />
      </div>

      {/* Demo Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Scenarios</CardTitle>
          <CardDescription>
            Try these example scenarios to see the AI features in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-red-700">😡 Angry Customer</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Sarah Johnson is frustrated about a billing issue and needs immediate resolution.
              </p>
              <div className="text-xs text-muted-foreground">
                <strong>Features demonstrated:</strong> High sentiment detection, empathetic response generation, priority escalation
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-blue-700">🔧 Technical Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Mike Chen needs help with API integration and is looking for detailed technical guidance.
              </p>
              <div className="text-xs text-muted-foreground">
                <strong>Features demonstrated:</strong> Technical tone responses, knowledge base integration, step-by-step solutions
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-green-700">💼 Sales Inquiry</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Emma Davis is interested in upgrading and wants to learn about premium features.
              </p>
              <div className="text-xs text-muted-foreground">
                <strong>Features demonstrated:</strong> Professional tone, sales opportunity detection, feature explanations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}