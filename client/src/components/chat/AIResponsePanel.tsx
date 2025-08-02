import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAIResponse } from '@/hooks/useAIResponse'
import { useResponseQuality } from '@/hooks/useResponseQuality'
import { Bot, RefreshCw, Copy, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { ConversationContext, CustomerProfile, ResponseTone } from '@/types/types'

interface AIResponsePanelProps {
  context: ConversationContext
  customerProfile: CustomerProfile
  onApplyResponse: (response: string) => void
  className?: string
}

export function AIResponsePanel({ 
  context, 
  customerProfile, 
  onApplyResponse,
  className = '' 
}: AIResponsePanelProps) {
  const [selectedTone, setSelectedTone] = useState<ResponseTone>(customerProfile.preferredTone)
  const [selectedResponse, setSelectedResponse] = useState<string>('')
  const [showQualityAnalysis, setShowQualityAnalysis] = useState(false)
  const { toast } = useToast()

  const aiResponse = useAIResponse()
  const responseQuality = useResponseQuality()

  const tones: { value: ResponseTone; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' },
    { value: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
    { value: 'technical', label: 'Technical', description: 'Detailed and precise' }
  ]

  const handleGenerateResponse = () => {
    const lastCustomerMessage = context.messages
      .filter(m => m.sender === 'customer')
      .slice(-1)[0]

    if (!lastCustomerMessage) {
      toast({
        title: "No customer message",
        description: "There are no customer messages to respond to.",
        variant: "destructive"
      })
      return
    }

    aiResponse.generateResponse({
      conversationHistory: context.messages,
      customerProfile,
      tone: selectedTone,
      includeKnowledge: true,
      maxTokens: 200
    })
  }

  const handleAnalyzeQuality = (response: string) => {
    if (!response.trim()) return

    setShowQualityAnalysis(true)
    responseQuality.evaluateResponse(response, JSON.stringify(context))
  }

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response).then(() => {
      toast({
        title: "Response copied",
        description: "The AI response has been copied to your clipboard.",
      })
    })
  }

  const handleApplyResponse = (response: string) => {
    onApplyResponse(response)
    toast({
      title: "Response applied",
      description: "The AI response has been applied to your message input.",
    })
  }

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
        
        {/* Tone Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Response Tone</label>
          <div className="grid grid-cols-2 gap-1">
            {tones.map((tone) => (
              <Button
                key={tone.value}
                variant={selectedTone === tone.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTone(tone.value)}
                className="text-xs p-2 h-auto flex flex-col items-start"
                title={tone.description}
              >
                <span className="font-medium">{tone.label}</span>
                <span className="text-xs opacity-70 line-clamp-1">{tone.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateResponse}
          disabled={aiResponse.isLoading}
          className="w-full flex items-center gap-2"
        >
          {aiResponse.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Response
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Error State */}
        {aiResponse.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Generation Failed</span>
            </div>
            <p className="text-sm text-red-700">{aiResponse.error.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateResponse}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        )}

        {/* Generated Responses */}
        {aiResponse.responses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Generated Responses</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateResponse}
                disabled={aiResponse.isLoading}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>

            {aiResponse.responses.map((response) => (
              <div
                key={response.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedResponse === response.content
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedResponse(response.content)}
              >
                {/* Response Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {response.tone}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(response.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  {response.qualityScore && (
                    <Badge className={`text-xs ${getQualityColor(response.qualityScore.overall)}`}>
                      {response.qualityScore.overall.toFixed(1)}/10
                    </Badge>
                  )}
                </div>

                {/* Response Content */}
                <div className="text-sm mb-3 whitespace-pre-wrap">
                  {response.content}
                </div>

                {/* Response Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyResponse(response.content)
                    }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApplyResponse(response.content)
                    }}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnalyzeQuality(response.content)
                    }}
                    className="flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Analyze
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quality Analysis */}
        {showQualityAnalysis && responseQuality.isLoading && (
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-medium text-sm">Analyzing Response Quality...</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Evaluating clarity, completeness, tone, accuracy, and actionability.
            </p>
          </div>
        )}

        {showQualityAnalysis && responseQuality.qualityScore && !responseQuality.isLoading && (
          <div className="p-3 border rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Quality Analysis
            </h4>

            {/* Overall Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Quality:</span>
              <Badge className={`${getQualityColor(responseQuality.qualityScore.overall)}`}>
                {responseQuality.qualityScore.overall.toFixed(1)}/10
              </Badge>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-2">
              {Object.entries(responseQuality.qualityScore)
                .filter(([key]) => key !== 'overall' && key !== 'suggestions')
                .map(([criterion, score]) => (
                  <div key={criterion} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{criterion}:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getQualityColor(score as number)}`}>
                      {(score as number).toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>

            {/* Suggestions */}
            {responseQuality.qualityScore.suggestions && responseQuality.qualityScore.suggestions.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Suggestions:</span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {responseQuality.qualityScore.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApplyResponse("Thank you for reaching out. I'm looking into this right now and will have an update for you shortly.")}
              className="justify-start text-xs"
            >
              Acknowledgment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApplyResponse("I understand your concern and want to make sure we resolve this completely. Let me gather some additional information to provide you with the best solution.")}
              className="justify-start text-xs"
            >
              Empathetic Response
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApplyResponse("I've reviewed your account and have identified the issue. Here are the next steps we'll take to resolve this...")}
              className="justify-start text-xs"
            >
              Solution Framework
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}