import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { User, UserCheck, Bot, Clock } from 'lucide-react'
import { SentimentIndicator } from './SentimentIndicator'
import type { Message, CustomerProfile } from '@/types/types'

interface MessageThreadProps {
  messages: Message[]
  customerProfile?: CustomerProfile | null
  isTyping?: boolean
  className?: string
}

export function MessageThread({ 
  messages, 
  customerProfile, 
  isTyping = false,
  className = '' 
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(timestamp))
  }

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }).format(date)
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''
    let currentGroup: Message[] = []

    messages.forEach(message => {
      const messageDate = formatDate(message.timestamp)
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="flex-1 border-t border-muted"></div>
              <span className="px-3 text-xs text-muted-foreground bg-background">
                {group.date}
              </span>
              <div className="flex-1 border-t border-muted"></div>
            </div>

            {/* Messages for this date */}
            {group.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'customer' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.sender === 'customer' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'customer'
                      ? 'bg-muted text-foreground'
                      : message.sender === 'ai'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {message.sender === 'customer' 
                          ? customerProfile?.name || 'Customer'
                          : message.sender === 'ai' 
                          ? 'AI Assistant'
                          : 'You'
                        }
                      </span>
                      {message.sender === 'ai' && (
                        <Bot className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>

                  {/* Sentiment Indicator for Customer Messages */}
                  {message.sender === 'customer' && message.sentiment && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <SentimentIndicator
                        score={message.sentiment.score}
                        trend="stable"
                        emotions={message.sentiment.emotions}
                        compact={true}
                      />
                    </div>
                  )}

                  {/* Message Metadata */}
                  {message.metadata && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <div className="text-xs opacity-70">
                        {Object.entries(message.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.sender !== 'customer' && (
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'ai' 
                        ? 'bg-purple-100' 
                        : 'bg-primary'
                    }`}>
                      {message.sender === 'ai' ? (
                        <Bot className="h-4 w-4 text-purple-600" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 max-w-[70%]">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <Clock className="h-3 w-3 text-muted-foreground ml-2" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  )
}