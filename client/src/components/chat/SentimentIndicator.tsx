import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Smile, Frown, Meh, AlertTriangle } from 'lucide-react'
import type { SentimentData } from '@/types/types'

interface SentimentIndicatorProps {
  score: number
  trend: 'improving' | 'declining' | 'stable'
  emotions?: SentimentData['emotions']
  className?: string
  compact?: boolean
}

export function SentimentIndicator({ 
  score, 
  trend, 
  emotions,
  className = '',
  compact = false 
}: SentimentIndicatorProps) {
  const sentimentData = useMemo(() => {
    let label: 'positive' | 'neutral' | 'negative'
    let color: string
    let bgColor: string
    let icon: React.ReactNode

    if (score >= 0.2) {
      label = 'positive'
      color = 'text-green-600'
      bgColor = 'bg-green-100'
      icon = <Smile className="h-3 w-3" />
    } else if (score <= -0.2) {
      label = 'negative'
      color = 'text-red-600'
      bgColor = 'bg-red-100'
      icon = <Frown className="h-3 w-3" />
    } else {
      label = 'neutral'
      color = 'text-yellow-600'
      bgColor = 'bg-yellow-100'
      icon = <Meh className="h-3 w-3" />
    }

    return { label, color, bgColor, icon }
  }, [score])

  const trendIcon = useMemo(() => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'declining':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }, [trend])

  const dominantEmotion = useMemo(() => {
    if (!emotions) return null
    
    const emotionEntries = Object.entries(emotions)
    const [emotionName, emotionValue] = emotionEntries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )

    if (emotionValue < 0.3) return null

    const emotionIcons: Record<string, React.ReactNode> = {
      anger: <AlertTriangle className="h-3 w-3 text-red-500" />,
      joy: <Smile className="h-3 w-3 text-green-500" />,
      fear: <AlertTriangle className="h-3 w-3 text-orange-500" />,
      sadness: <Frown className="h-3 w-3 text-blue-500" />,
      surprise: <AlertTriangle className="h-3 w-3 text-purple-500" />
    }

    return {
      name: emotionName,
      value: emotionValue,
      icon: emotionIcons[emotionName]
    }
  }, [emotions])

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className={`px-2 py-1 rounded-full ${sentimentData.bgColor} flex items-center gap-1`}>
          {sentimentData.icon}
          <span className={`text-xs font-medium ${sentimentData.color}`}>
            {Math.abs(score * 100).toFixed(0)}%
          </span>
        </div>
        {trendIcon}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Sentiment Display */}
      <div className="flex items-center gap-3">
        <div className={`px-3 py-2 rounded-lg ${sentimentData.bgColor} flex items-center gap-2`}>
          {sentimentData.icon}
          <div>
            <div className={`font-medium ${sentimentData.color} capitalize`}>
              {sentimentData.label}
            </div>
            <div className="text-xs text-muted-foreground">
              Score: {(score * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {trendIcon}
          <span className="text-xs text-muted-foreground capitalize">
            {trend}
          </span>
        </div>
      </div>

      {/* Sentiment Meter */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 relative">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              score >= 0.2 ? 'bg-green-500' :
              score <= -0.2 ? 'bg-red-500' :
              'bg-yellow-500'
            }`}
            style={{ 
              width: `${Math.abs(score) * 50}%`,
              marginLeft: score < 0 ? `${50 - Math.abs(score) * 50}%` : '50%'
            }}
          />
          {/* Center line */}
          <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-400 transform -translate-x-1/2" />
        </div>
      </div>

      {/* Dominant Emotion */}
      {dominantEmotion && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Dominant emotion:</span>
          <div className="flex items-center gap-1">
            {dominantEmotion.icon}
            <span className="font-medium capitalize">
              {dominantEmotion.name} ({(dominantEmotion.value * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {/* Detailed Emotions (in non-compact mode) */}
      {emotions && !compact && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Emotion Breakdown:</span>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(emotions).map(([emotion, value]) => (
              <div key={emotion} className="flex justify-between">
                <span className="capitalize">{emotion}:</span>
                <span>{(value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}